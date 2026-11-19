import {
  CodeBlock,
  CodeEditor,
  OutputPanel,
  OutputPanels,
  PaneSection,
  ProblemStatement,
  TaskStrip,
  TestRow,
} from "@tech-prep/ui";
import type { OutputState } from "@tech-prep/ui";

import { AttemptFooter } from "./attempt-footer";
import type { WorkbenchProps } from "./checks";
import type { CommandView, Preview, Problem, Run } from "./types";
import { useAnswer } from "./use-answer";

/** Wait this long after the last keystroke before running the command and saving it. */
const RUN_DELAY_MS = 250;

const commandOf = (problem: Problem): CommandView | null =>
  problem.check?.type === "command" ? problem.check : null;

const stateOf = (preview: Preview): OutputState => {
  if (preview.error) {
    return "error";
  }

  return preview.matches ? "matches" : "differs";
};

/** A program's error and whatever was printed before it, as a terminal shows them. */
const shownOutput = (preview: Preview): string =>
  [preview.output, preview.error].filter(Boolean).join("\n");

/** A command exercise's input, for the column that holds its statement. */
export const CommandAside = ({ problem }: { problem: Problem }) => {
  const check = commandOf(problem);

  return (
    check && (
      <>
        <p className="tp-task-text__label">
          Input<code> · {check.file}</code>
        </p>
        <CodeBlock code={check.input} />
      </>
    )
  );
};

/** The first hidden input the answer got wrong, so the learner sees why Submit said no. */
const Failed = ({ run, program }: { run: Run; program: string }) => {
  const failed = run.cases.find((c) => !c.ok);

  if (run.fatal || !failed) {
    return run.fatal ? (
      <TestRow
        detail={run.fatal}
        name={`${program} did not run`}
        status="fail"
      />
    ) : null;
  }

  return (
    <TestRow
      detail={
        failed.error
          ? `${failed.input} → ${failed.error}`
          : `${failed.input} → wanted ${failed.expected}, got ${failed.actual ?? "nothing"}`
      }
      name={`${run.passed} of ${run.total} inputs pass. One that does not:`}
      status="fail"
    />
  );
};

/** What the text printed on the shown input, and whether it is the wanted output. */
const Printed = ({
  preview,
  fromSolution,
}: {
  preview: Preview | null;
  /** True when the output is the worked solution's, not the learner's. */
  fromSolution: boolean;
}) => (
  <OutputPanel
    empty={preview ? "Nothing was printed." : ""}
    label={fromSolution ? "Output of the solution" : "Your output"}
    state={preview && !fromSolution ? stateOf(preview) : undefined}
    text={preview ? shownOutput(preview) : ""}
  />
);

/**
 * An exercise checked by running a command: the command line, what it prints on the shown
 * input as the learner types, and the wanted output. Submit also checks the hidden inputs,
 * and the engine grades the attempt.
 */
export const CommandWorkbench = ({
  problem,
  strip,
  note,
  onAskTutor,
  onFinished,
  done,
}: WorkbenchProps) => {
  const { slug } = problem;
  const check = commandOf(problem);

  const { busy, code, edit, giveUp, handedIn, preview, run, solution, submit } =
    useAnswer({
      delay: RUN_DELAY_MS,
      live: true,
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
      {shown ? (
        <CodeBlock code={shown.trimEnd()} lineNumbers />
      ) : (
        <CodeEditor
          compact
          file="terminal"
          initialValue={code.text.trimEnd()}
          key={slug}
          language={code.language}
          readOnly={!code.editable}
          onChange={edit}
        />
      )}
      <OutputPanels
        input={
          strip && (
            <OutputPanel file={check.file} label="Input" text={check.input} />
          )
        }
        wanted={
          <OutputPanel
            empty="Nothing is printed."
            label="Wanted output"
            text={check.wanted}
          />
        }
        yours={<Printed fromSolution={Boolean(solution)} preview={preview} />}
      />
      {failed && !done && (
        <PaneSection dock>
          <Failed program={check.program} run={run} />
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
