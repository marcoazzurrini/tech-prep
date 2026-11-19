import { CodeBlock, CodeEditor, PaneSection, TestRow } from "@tech-prep/ui";

import { AttemptFooter } from "./attempt-footer";
import type { WorkbenchProps } from "./checks";
import type { Run } from "./types";
import { useAnswer } from "./use-answer";

/** Wait this long after the last keystroke before saving. */
const SAVE_DELAY_MS = 400;

const EXTENSIONS = new Map([
  ["python", "py"],
  ["typescript", "ts"],
]);

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

/**
 * An exercise checked by calling a function: the editor, the tests and the footer. Submit
 * runs the tests; when they all pass, the engine grades the attempt and the footer changes
 * to what comes next.
 */
export const FunctionWorkbench = ({
  problem,
  note,
  onAskTutor,
  onFinished,
  done,
}: WorkbenchProps) => {
  const { slug } = problem;

  const { busy, code, edit, giveUp, run, solution, submit, test } = useAnswer({
    delay: SAVE_DELAY_MS,
    live: false,
    onFinished,
    resetOnEdit: false,
    slug,
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
          file={`${slug}.${EXTENSIONS.get(code.language) ?? code.language}`}
          initialValue={code.text}
          key={slug}
          language={code.language}
          onChange={edit}
        />
      )}
      <PaneSection dock label={solution ? "A solution" : label}>
        {!solution && <Tests run={run} />}
      </PaneSection>
      <AttemptFooter
        busy={busy}
        done={done}
        note={note}
        onGiveUp={() => {
          void giveUp();
        }}
        onHint={hint}
        onSubmit={() => {
          void submit();
        }}
        onTest={() => {
          void test();
        }}
      />
    </>
  );
};
