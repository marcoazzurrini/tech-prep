// The learner's answer to the exercise that is open: loading it, saving it as they type,
// and handing it in. Every workbench talks to the engine through this, so each one only
// draws its own way of taking an answer.

import { useCallback, useEffect, useRef, useState } from "react";

import { engine } from "./course";
import type { Code, GaveUp, Preview, Run } from "./types";

/** How an exercise ended: what grading it did, and the worked solution if the learner gave up. */
export interface Finished extends GaveUp {
  /** How many times the learner handed an answer in. */
  tries: number;
}

interface Options {
  slug: string;
  /** Wait this long after the last keystroke before saving. */
  delay: number;
  /** True when the check shows what the text does while the learner types. */
  live: boolean;
  /** True when an edit clears the last result, because it no longer describes the text. */
  resetOnEdit: boolean;
  /** Called once, when the exercise is solved or given up. */
  onFinished: (finished: Finished) => void;
}

export const useAnswer = ({
  slug,
  delay,
  live,
  resetOnEdit,
  onFinished,
}: Options) => {
  const [code, setCode] = useState<Code | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  /** The answer that was handed in, kept to show once the exercise is finished. */
  const [handedIn, setHandedIn] = useState<string | null>(null);
  /** Answers handed in that were not right. */
  const misses = useRef(0);
  const text = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Save the text and, for a live check, show what it does. */
  const save = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const { current } = text;
    await engine("code.save", { slug, text: current });

    if (!live) {
      return;
    }

    const seen = await engine("answer.preview", { slug, text: current });

    // A slow run must not overwrite the output of what was typed after it.
    if (text.current === current) {
      setPreview(seen);
    }
  }, [slug, live]);

  useEffect(() => {
    let current = true;

    const load = async () => {
      const loaded = await engine("code.read", { slug });

      if (!current) {
        return;
      }

      text.current = loaded.text;
      setCode(loaded);

      if (!live) {
        return;
      }

      // An answer that cannot be edited has no attempt to save to: it is only shown.
      if (loaded.editable) {
        await save();
      } else {
        setPreview(await engine("answer.preview", { slug, text: loaded.text }));
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, [slug, live, save]);

  const edit = useCallback(
    (value: string) => {
      text.current = value;

      if (resetOnEdit) {
        setRun(null);
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        void save();
      }, delay);
    },
    [save, delay, resetOnEdit]
  );

  /** Run a step that talks to the engine. If it fails, its error is shown as the result. */
  const act = async (step: () => Promise<void>) => {
    setBusy(true);

    try {
      await save();
      await step();
    } catch (error) {
      setRun({
        cases: [],
        fatal: error instanceof Error ? error.message : String(error),
        passed: 0,
        total: 0,
      });
    }

    setBusy(false);
  };

  /** Check the answer without handing it in. */
  const test = () =>
    act(async () => {
      setRun(await engine("code.run", { slug }));
    });

  const submit = () =>
    act(async () => {
      const handed = await engine("code.submit", { slug });
      setRun(handed.run);

      if (handed.result) {
        setHandedIn(text.current);
        onFinished({
          result: handed.result,
          solution: null,
          tries: misses.current + 1,
        });
      } else {
        misses.current += 1;
      }
    });

  const giveUp = () =>
    act(async () => {
      const gave = await engine("attempt.give_up", { slug });
      setSolution(gave.solution);

      if (live) {
        setPreview(
          await engine("answer.preview", { slug, text: gave.solution ?? "" })
        );
      }

      onFinished({ ...gave, tries: misses.current });
    });

  return {
    busy,
    code,
    edit,
    giveUp,
    handedIn,
    preview,
    run,
    solution,
    submit,
    test,
  };
};
