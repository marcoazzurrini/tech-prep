import {
  Button,
  CodeBlock,
  CodeEditor,
  PaneFooter,
  PaneSection,
  TestRow,
} from "@tech-prep/ui";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { engine } from "./course";
import type { Code, GaveUp, Handed, Problem, Result, Run } from "./types";

/** Wait this long after the last keystroke before saving. */
const SAVE_DELAY_MS = 400;

const EXTENSION = { jq: "jq", python: "py", typescript: "ts" };

/** Why a case failed, in one line. */
const detail = (c: Run["cases"][number]): string | undefined => {
  if (c.ok) {
    return undefined;
  }

  return c.error
    ? `${c.input} → ${c.error}`
    : `${c.input} → expected ${c.expected}, got ${c.actual}`;
};

const Tests = ({ run }: { run: Run | null }) => {
  if (!run) {
    return null;
  }

  if (run.fatal) {
    return (
      <TestRow
        detail={run.fatal.split("\n").at(-1)}
        name="The code did not run"
        status="fail"
      />
    );
  }

  return (
    <>
      {run.cases.map((c, i) => (
        <TestRow
          detail={detail(c)}
          key={i}
          name={`Case ${i + 1}`}
          status={c.ok ? "pass" : "fail"}
        />
      ))}
    </>
  );
};

/** How a problem ended: its grade, and a worked solution when the learner gave up. */
export interface Finished {
  result: Result;
  solution: string | null;
}

interface WorkbenchProps {
  problem: Problem;
  /** Shown on the left of the footer while the learner works. */
  note?: string;
  /** Open the tutor pane, for when the learner asks for a hint. */
  onAskTutor: () => void;
  /** Called once, when the problem is solved or given up. */
  onFinished: (finished: Finished) => void;
  /** Once finished: the footer's note and its buttons, such as "Next lesson". */
  done?: { note: string; actions: ReactNode };
}

/**
 * The editor, the tests and the footer for one open problem. Submit runs the tests; when
 * they all pass, the engine grades the attempt and the footer changes to what comes next.
 */
export const Workbench = ({
  problem,
  note,
  onAskTutor,
  onFinished,
  done,
}: WorkbenchProps) => {
  const [code, setCode] = useState<Code | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const text = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { slug } = problem;

  useEffect(() => {
    let current = true;

    const load = async () => {
      const loaded = await engine<Code>("code.read", { slug });

      if (current) {
        text.current = loaded.text;
        setCode(loaded);
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, [slug]);

  const save = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    await engine("code.save", { slug, text: text.current });
  }, [slug]);

  const edit = useCallback(
    (value: string) => {
      text.current = value;

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        void save();
      }, SAVE_DELAY_MS);
    },
    [save]
  );

  /** Run a step that talks to the engine, showing its error in the test list if it fails. */
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

  const test = () =>
    act(async () => {
      setRun(await engine<Run>("code.run", { slug }));
    });

  const submit = () =>
    act(async () => {
      const handed = await engine<Handed>("code.submit", { slug });
      setRun(handed.run);

      if (handed.result) {
        onFinished({ result: handed.result, solution: null });
      }
    });

  const giveUp = () =>
    act(async () => {
      const gave = await engine<GaveUp>("attempt.give_up", { slug });
      setSolution(gave.solution);
      onFinished(gave);
    });

  const hint = () => {
    onAskTutor();
    window.tp.tutor.notify("The learner asked for a hint on this problem.");
  };

  if (!code) {
    return null;
  }

  let label = "Tests · not run yet";

  if (run) {
    label = run.fatal
      ? "Tests · did not run"
      : `Tests · ${run.passed} of ${run.total} passed`;
  }

  return (
    <>
      {solution ? (
        <CodeBlock code={solution.trimEnd()} grow lineNumbers />
      ) : (
        <CodeEditor
          file={`${slug}.${EXTENSION[code.language]}`}
          initialValue={code.text}
          key={slug}
          language={code.language}
          onChange={edit}
        />
      )}
      <PaneSection dock label={solution ? "A solution" : label}>
        {!solution && <Tests run={run} />}
      </PaneSection>
      {done ? (
        <PaneFooter
          start={<span className="tp-pane-footer__note">{done.note}</span>}
        >
          {done.actions}
        </PaneFooter>
      ) : (
        <PaneFooter
          start={
            <>
              <Button
                disabled={busy}
                variant="ghost"
                onClick={() => {
                  void giveUp();
                }}
              >
                Give up
              </Button>
              {note && <span className="tp-pane-footer__note">{note}</span>}
            </>
          }
        >
          <Button onClick={hint}>Show hint</Button>
          <Button
            disabled={busy}
            onClick={() => {
              void test();
            }}
          >
            Run tests
          </Button>
          <Button
            disabled={busy}
            variant="primary"
            onClick={() => {
              void submit();
            }}
          >
            Submit
          </Button>
        </PaneFooter>
      )}
    </>
  );
};
