import {
  CodeBlock,
  CodeEditor,
  OutputPanel,
  OutputStack,
  PaneSection,
  ProblemStatement,
  TaskStrip,
  TestRow,
} from "@tech-prep/ui";
import { Fragment } from "react";

import { AttemptFooter } from "./attempt-footer";
import type { WorkbenchProps } from "./checks";
import type { Problem, Run, ValueView } from "./types";
import { useAnswer } from "./use-answer";

/** Wait this long after the last keystroke before saving. */
const SAVE_DELAY_MS = 250;

const valueOf = (problem: Problem): ValueView | null =>
  problem.check?.type === "value" ? problem.check : null;

/** What a value exercise asks about, for the column that holds its statement. */
export const ValueAside = ({ problem }: { problem: Problem }) =>
  valueOf(problem)?.shown.map((item) => (
    <Fragment key={item.label}>
      <p className="tp-task-text__label">
        {item.label}
        {item.file && <code> · {item.file}</code>}
      </p>
      <CodeBlock code={item.text} />
    </Fragment>
  )) ?? null;

/** Why Submit said no. The wanted value is never shown: finding it is the exercise. */
const Failed = ({ run }: { run: Run }) => {
  const failed = run.cases.find((c) => !c.ok);

  if (run.fatal) {
    return (
      <TestRow
        detail={run.fatal}
        name="The answer was not checked"
        status="fail"
      />
    );
  }

  return failed ? (
    <TestRow
      detail={failed.error ?? "Read what is shown again, one step at a time."}
      name="That is not what comes out"
      status="fail"
    />
  ) : null;
};

/**
 * An exercise that asks what comes out: what it shows to work from, and a line to type the
 * value in. Nothing runs while the learner types. Submit checks the value, and the engine
 * grades the attempt.
 */
export const ValueWorkbench = ({
  problem,
  strip,
  note,
  onAskTutor,
  onFinished,
  done,
}: WorkbenchProps) => {
  const { slug } = problem;
  const check = valueOf(problem);

  const { busy, code, edit, giveUp, handedIn, run, solution, submit } =
    useAnswer({
      delay: SAVE_DELAY_MS,
      live: false,
      onFinished,
      resetOnEdit: true,
      slug,
    });

  const hint = () => {
    onAskTutor();
    window.tp.tutor.notify("The learner asked for a hint on this task.");
  };

  if (!code || !check) {
    return null;
  }

  const failed = run && (run.fatal || run.passed !== run.total);
  const shown = solution ?? handedIn;

  return (
    <>
      {strip && (
        <TaskStrip label={strip.label} title={problem.title}>
          <ProblemStatement text={problem.statement ?? ""} />
        </TaskStrip>
      )}
      {/* Without a strip, what the exercise shows sits beside its statement. */}
      <OutputStack>
        {strip &&
          check.shown.map((item) => (
            <OutputPanel
              file={item.file}
              key={item.label}
              label={item.label}
              text={item.text}
            />
          ))}
      </OutputStack>
      {shown ? (
        <CodeBlock code={shown.trimEnd()} lineNumbers />
      ) : (
        <CodeEditor
          compact
          file="the value that comes out"
          initialValue={code.text.trimEnd()}
          key={slug}
          language={code.language}
          readOnly={!code.editable}
          onChange={edit}
        />
      )}
      {failed && !done && (
        <PaneSection dock>
          <Failed run={run} />
        </PaneSection>
      )}
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
      />
    </>
  );
};
