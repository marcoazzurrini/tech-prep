import {
  Button,
  CodeBlock,
  CodeEditor,
  OutputPanel,
  OutputPanels,
  OutputStack,
  PaneFooter,
  PaneSection,
  ProblemStatement,
  TaskStrip,
  TestRow,
} from "@tech-prep/ui";
import type { OutputState } from "@tech-prep/ui";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { engine } from "./course";
import type {
  Code,
  GaveUp,
  Handed,
  JqPreview,
  JqTask,
  Problem,
  Run,
} from "./types";
import type { Finished } from "./workbench";

/** Wait this long after the last keystroke before running the filter and saving it. */
const RUN_DELAY_MS = 250;

const stateOf = (preview: JqPreview): OutputState => {
  if (preview.error) {
    return "error";
  }

  return preview.matches ? "matches" : "differs";
};

/** A jq error and whatever was printed before it, as jq shows them in a terminal. */
const shownOutput = (preview: JqPreview): string =>
  [preview.output, preview.error].filter(Boolean).join("\n");

/** A jq task's input, for the column that holds its statement. */
export const JqInput = ({ jq }: { jq: JqTask }) => (
  <>
    <p className="tp-task-text__label">Input · {jq.file}</p>
    <CodeBlock code={jq.input} />
    {jq.command && (
      <>
        <p className="tp-task-text__label">Command</p>
        <CodeBlock code={jq.command} />
      </>
    )}
  </>
);

/** The first hidden input the answer got wrong, so the learner sees why Submit said no. */
const Failed = ({ run, predict }: { run: Run; predict: boolean }) => {
  const failed = run.cases.find((c) => !c.ok);

  // A predict task must not show the wanted value: finding it is the task.
  if (predict && failed) {
    return (
      <TestRow
        detail={
          failed.error ??
          "Read the input and the filter again, one step at a time."
        }
        name="That is not what comes out"
        status="fail"
      />
    );
  }

  if (run.fatal || !failed) {
    return run.fatal ? (
      <TestRow detail={run.fatal} name="jq did not run" status="fail" />
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
  preview: JqPreview | null;
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

/** What a "what comes out?" task asks about: the input, and the filter when it shows one. */
const Asked = ({
  jq,
  shown,
}: {
  jq: JqTask;
  /** False when the input and the filter are shown beside the statement. */
  shown: boolean;
}) => (
  <OutputStack>
    {shown && <OutputPanel label={`Input · ${jq.file}`} text={jq.input} />}
    {shown && jq.command && <OutputPanel label="Command" text={jq.command} />}
  </OutputStack>
);

interface FooterProps {
  busy: boolean;
  note?: string;
  done?: { note: string; actions: ReactNode };
  onGiveUp: () => void;
  onHint: () => void;
  onSubmit: () => void;
}

/** The buttons under a task, or what comes next once it is finished. */
const Footer = ({
  busy,
  note,
  done,
  onGiveUp,
  onHint,
  onSubmit,
}: FooterProps) =>
  done ? (
    <PaneFooter
      start={<span className="tp-pane-footer__note">{done.note}</span>}
    >
      {done.actions}
    </PaneFooter>
  ) : (
    <PaneFooter
      start={
        <>
          <Button disabled={busy} variant="ghost" onClick={onGiveUp}>
            Give up
          </Button>
          {note && <span className="tp-pane-footer__note">{note}</span>}
        </>
      }
    >
      <Button onClick={onHint}>Show hint</Button>
      <Button disabled={busy} variant="primary" onClick={onSubmit}>
        Submit
      </Button>
    </PaneFooter>
  );

interface JqWorkbenchProps {
  problem: Problem;
  jq: JqTask;
  /**
   * The task above the filter, with the input beside the outputs. Left out when the
   * statement and the input are shown elsewhere on the screen.
   */
  strip?: { label: string; tasks?: { done: number; total: number } };
  /** Shown on the left of the footer while the learner works. */
  note?: string;
  onAskTutor: () => void;
  /** Called once, when the task is solved or given up. */
  onFinished: (finished: Finished) => void;
  /** Once finished: the footer's note and its buttons, such as "Next task". */
  done?: { note: string; actions: ReactNode };
}

/**
 * A jq task: the filter, what it prints on the shown input as the learner types, and the
 * wanted output. Submit also checks the hidden inputs, and the engine grades the attempt.
 */
export const JqWorkbench = ({
  problem,
  jq,
  strip,
  note,
  onAskTutor,
  onFinished,
  done,
}: JqWorkbenchProps) => {
  const [code, setCode] = useState<Code | null>(null);
  const [preview, setPreview] = useState<JqPreview | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  /** The answer that was handed in, shown read-only once the task is finished. */
  const [answer, setAnswer] = useState<string | null>(null);
  const text = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { slug } = problem;
  const { predict } = jq;

  /** Run the text on the shown input and save it. */
  const refresh = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    const { current } = text;
    await engine("code.save", { slug, text: current });

    if (predict) {
      return;
    }

    const seen = await engine<JqPreview>("jq.preview", { slug, text: current });

    // A slow run must not overwrite the output of what was typed after it.
    if (text.current === current) {
      setPreview(seen);
    }
  }, [slug, predict]);

  useEffect(() => {
    let current = true;

    const load = async () => {
      const loaded = await engine<Code>("code.read", { slug });

      if (!current) {
        return;
      }

      text.current = loaded.text;
      setCode(loaded);

      if (loaded.editable) {
        await refresh();
      } else if (!predict) {
        setPreview(
          await engine<JqPreview>("jq.preview", { slug, text: loaded.text })
        );
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, [slug, refresh, predict]);

  const edit = useCallback(
    (value: string) => {
      text.current = value;
      setRun(null);

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        void refresh();
      }, RUN_DELAY_MS);
    },
    [refresh]
  );

  /** Run a step that talks to the engine, showing its error under the outputs if it fails. */
  const act = async (step: () => Promise<void>) => {
    setBusy(true);

    try {
      await refresh();
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

  const submit = () =>
    act(async () => {
      const handed = await engine<Handed>("code.submit", { slug });
      setRun(handed.run);

      if (handed.result) {
        setAnswer(text.current);
        onFinished({ result: handed.result, solution: null });
      }
    });

  const giveUp = () =>
    act(async () => {
      const gave = await engine<GaveUp>("attempt.give_up", { slug });
      setSolution(gave.solution);

      if (!predict) {
        setPreview(
          await engine<JqPreview>("jq.preview", {
            slug,
            text: gave.solution ?? "",
          })
        );
      }

      onFinished(gave);
    });

  const hint = () => {
    onAskTutor();
    window.tp.tutor.notify("The learner asked for a hint on this task.");
  };

  if (!code) {
    return null;
  }

  const failed = run && (run.fatal || run.passed !== run.total);

  const editor =
    (solution ?? answer) ? (
      <CodeBlock code={(solution ?? answer ?? "").trimEnd()} lineNumbers />
    ) : (
      <CodeEditor
        compact
        file={predict ? "the value that comes out" : "terminal"}
        initialValue={code.text.trimEnd()}
        key={slug}
        language="jq"
        readOnly={!code.editable}
        onChange={edit}
      />
    );

  return (
    <>
      {strip && (
        <TaskStrip
          label={strip.label}
          tasks={strip.tasks}
          title={problem.title}
        >
          <ProblemStatement text={problem.statement ?? ""} />
        </TaskStrip>
      )}
      {!predict && editor}
      {predict ? (
        <>
          <Asked jq={jq} shown={Boolean(strip)} />
          {editor}
        </>
      ) : (
        <OutputPanels
          input={
            strip && (
              <OutputPanel label={`Input · ${jq.file}`} text={jq.input} />
            )
          }
          wanted={
            <OutputPanel
              empty="Nothing is printed."
              label="Wanted output"
              text={jq.wanted}
            />
          }
          yours={<Printed fromSolution={Boolean(solution)} preview={preview} />}
        />
      )}
      {failed && !done && (
        <PaneSection dock>
          <Failed predict={predict} run={run} />
        </PaneSection>
      )}
      <Footer
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
