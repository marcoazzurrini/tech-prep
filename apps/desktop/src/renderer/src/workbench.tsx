import {
  Button,
  CodeEditor,
  PaneFooter,
  PaneSection,
  TestRow,
} from "@tech-prep/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Code, Problem, Run } from "./types";

/** Wait this long after the last keystroke before saving. */
const SAVE_DELAY_MS = 400;

const EXTENSION = { python: "py", typescript: "ts" };

/** Why a case failed, in one line. */
const detail = (c: Run["cases"][number]): string | undefined => {
  if (c.ok) {
    return undefined;
  }

  return c.error
    ? `${c.input} → ${c.error}`
    : `${c.input} → expected ${c.expected}, got ${c.actual}`;
};

const summary = (run: Run): string => {
  if (run.fatal) {
    return `The code did not run: ${run.fatal.split("\n").at(-1)}`;
  }

  const failed = run.cases.find((c) => !c.ok);

  return failed
    ? `${run.passed} of ${run.total} tests pass. First failing case: ${detail(failed)}.`
    : `All ${run.total} tests pass.`;
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

interface WorkbenchProps {
  problem: Problem;
  /** Open the tutor pane, for when the learner asks for a hint. */
  onAskTutor: () => void;
}

/** The editor, the tests and the Run and Submit buttons for the problem the tutor opened. */
export const Workbench = ({ problem, onAskTutor }: WorkbenchProps) => {
  const [code, setCode] = useState<Code | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const text = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { slug } = problem;

  useEffect(() => {
    let current = true;

    const load = async () => {
      // SAFETY: the bridge's `code.read` method returns a Code.
      const loaded = (await window.tp.engine("code.read", { slug })) as Code;

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

    await window.tp.engine("code.save", { slug, text: text.current });
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

  /** Run the tests. Submit also hands the result to the tutor. */
  const test = async (handIn: boolean) => {
    setBusy(true);

    try {
      await save();
      // SAFETY: the bridge's `code.run` method returns a Run.
      const result = (await window.tp.engine("code.run", { slug })) as Run;
      setRun(result);

      if (handIn) {
        const passed = !result.fatal && result.passed === result.total;
        setSubmitted(passed);
        window.tp.tutor.notify(
          `The learner submitted '${problem.title}'. ${summary(result)}${passed ? " Read their code, then do the teach-back." : ""}`
        );
      }
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

  const locked = busy || submitted;

  return (
    <>
      <CodeEditor
        file={`${slug}.${EXTENSION[code.language]}`}
        initialValue={code.text}
        key={slug}
        language={code.language}
        onChange={edit}
      />
      <PaneSection dock label={label}>
        <Tests run={run} />
      </PaneSection>
      <PaneFooter
        start={
          submitted ? (
            <span className="tp-pane-footer__note">Submitted</span>
          ) : undefined
        }
      >
        {!submitted && <Button onClick={hint}>Show hint</Button>}
        <Button
          disabled={locked}
          onClick={() => {
            void test(false);
          }}
        >
          Run tests
        </Button>
        <Button
          disabled={locked}
          variant="primary"
          onClick={() => {
            void test(true);
          }}
        >
          Submit
        </Button>
      </PaneFooter>
    </>
  );
};
