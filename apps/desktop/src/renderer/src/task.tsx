import {
  Button,
  CodeBlock,
  CodeEditor,
  Credit,
  CreditRow,
  IconButton,
  inline,
  lead,
  LessonText,
  OutputPanel,
  PaneSection,
  ProblemStatement,
  RunPanels,
  SessionActions,
  SessionBody,
  SessionHelp,
  SessionNote,
  TaskStrip,
  TestRow,
} from "@tech-prep/ui";
import type { OutputState } from "@tech-prep/ui";
import { ArrowUp, BookOpen } from "lucide-react";
import { useState } from "react";

import { engine, inDays, useEnter } from "./course";
import type {
  CheckView,
  Lesson,
  Mode,
  Preview,
  Problem,
  Result,
  Run,
} from "./types";
import { useAnswer } from "./use-answer";
import type { Finished } from "./use-answer";

/** Wait this long after the last keystroke before saving, and running a command. */
const SAVE_DELAY_MS = 250;

const EXTENSIONS = new Map([
  ["javascript", "js"],
  ["python", "py"],
  ["typescript", "ts"],
]);

/** What the editor's status strip says about running the answer, per way of checking. */
const NOTES: Partial<Record<CheckView["type"], string>> = {
  command: "Runs as you type",
  function: ":w runs the tests",
  value: "⌘↵ hands it in",
};

/** True for an answer of a line or two: a command, or a value that comes out. */
const isShort = (problem: Problem): boolean =>
  problem.check?.type === "command" || problem.check?.type === "value";

/**
 * What heads a task, and the text under it. A problem from a list has a name. A short task
 * has none worth showing: its heading is the first line of its statement, which says what
 * to do.
 */
const headingOf = (problem: Problem) => {
  const statement = problem.statement ?? "";

  if (!isShort(problem)) {
    return { rest: statement, title: problem.title };
  }

  const { rest, title } = lead(statement);

  return { rest, title: title || problem.title };
};

const stateOf = (preview: Preview): OutputState => {
  if (preview.error) {
    return "error";
  }

  return preview.matches ? "matches" : "differs";
};

/** A program's error and whatever was printed before it, as a terminal shows them. */
const printed = (preview: Preview | null): string =>
  preview ? [preview.output, preview.error].filter(Boolean).join("\n") : "";

/** Why a test case failed, in one line. */
const caseDetail = (c: Run["cases"][number]): string | undefined => {
  if (c.ok) {
    return undefined;
  }

  return c.error
    ? `${c.input} → ${c.error}`
    : `${c.input} → wanted ${c.expected}, got ${c.actual ?? "nothing"}`;
};

/** What the last Submit or test run found, for the way this task is checked. */
const Checked = ({ problem, run }: { problem: Problem; run: Run | null }) => {
  if (!run || (!run.fatal && run.passed === run.total && isShort(problem))) {
    return null;
  }

  if (run.fatal) {
    return (
      <PaneSection>
        <TestRow
          detail={run.fatal.split("\n").at(-1)}
          name="The answer did not run"
          status="fail"
        />
      </PaneSection>
    );
  }

  const failed = run.cases.find((c) => !c.ok);

  // The wanted value is never shown: finding it is the exercise.
  if (problem.check?.type === "value") {
    return (
      <PaneSection>
        <TestRow
          detail={
            failed?.error ?? "Read what is shown again, one step at a time."
          }
          name="That is not what comes out"
          status="fail"
        />
      </PaneSection>
    );
  }

  if (problem.check?.type === "command") {
    return (
      <PaneSection>
        <TestRow
          detail={failed && caseDetail(failed)}
          name={`${run.passed} of ${run.total} inputs pass. One that does not:`}
          status="fail"
        />
      </PaneSection>
    );
  }

  return (
    <PaneSection label={`Tests · ${run.passed} of ${run.total} passed`}>
      {run.cases.map((c, i) => (
        <TestRow
          detail={caseDetail(c)}
          key={i}
          name={`Case ${i + 1}`}
          status={c.ok ? "pass" : "fail"}
        />
      ))}
    </PaneSection>
  );
};

/** What the task shows to work from, and what the answer does on it. */
const Shown = ({
  problem,
  preview,
}: {
  problem: Problem;
  preview: Preview | null;
}) => {
  const { check } = problem;

  if (check?.type === "command") {
    return (
      <RunPanels>
        <OutputPanel file={check.file} label="Input" text={check.input} />
        <OutputPanel
          empty={preview ? "Nothing was printed." : ""}
          label="Your output"
          state={preview ? stateOf(preview) : undefined}
          text={printed(preview)}
        />
        <OutputPanel
          empty="Nothing is printed."
          label="Wanted output"
          text={check.wanted}
        />
      </RunPanels>
    );
  }

  if (check?.type === "value") {
    return (
      <RunPanels>
        {check.shown.map((item) => (
          <OutputPanel
            file={item.file}
            key={item.label}
            label={item.label}
            text={item.text}
          />
        ))}
      </RunPanels>
    );
  }

  return null;
};

/** How the answer went, in a sentence. */
const verdict = ({ result, tries }: Finished): string => {
  if (result.outcome === "solved") {
    return tries > 1 ? `Right on try ${tries}.` : "Right first time.";
  }

  return result.outcome === "solved_with_help"
    ? "Solved with help. This one comes back, so you can solve it alone."
    : "A solution is shown. Read it, then go on.";
};

type Graded = Result["concepts"][number];

/** What the answer changed for one concept, in a few words. */
const creditOf = (c: Graded): string => {
  if (c.effect.includes("practice only")) {
    return "practice only";
  }

  if (c.effect.startsWith("passed")) {
    return "learned · comes back tomorrow";
  }

  if (c.result === "fail") {
    return c.next_review ? `comes back ${inDays(c.next_review)}` : "learning";
  }

  return c.next_review
    ? `reviewed · next ${inDays(c.next_review)}`
    : "reviewed";
};

/** The concepts a finished task practised. A review names them only here, after the answer. */
const Practised = ({ result }: { result: Result }) =>
  result.concepts.length > 0 && (
    <Credit
      title={`This task practised ${result.concepts.length} concept${result.concepts.length === 1 ? "" : "s"}`}
    >
      {result.concepts.map((c) => (
        <CreditRow
          effect={creditOf(c)}
          key={c.id}
          name={c.name}
          tone={c.result}
        />
      ))}
    </Credit>
  );

/** A lesson's parts as one text, each under its own heading. */
const lessonText = (lesson: Lesson): string =>
  lesson.parts
    .map((p) =>
      p.title === lesson.name ? p.text : `## ${p.title}\n\n${p.text}`
    )
    .join("\n\n");

/** The task above everything else: what to do, in one strip. */
const Strip = ({ problem }: { problem: Problem }) => {
  const heading = headingOf(problem);

  return (
    <TaskStrip title={inline(heading.title)}>
      {heading.rest && <ProblemStatement text={heading.rest} />}
    </TaskStrip>
  );
};

interface AnsweredProps {
  problem: Problem;
  finished: Finished;
  /** The answer that was handed in, or the worked solution. */
  text: string;
  /** What that text prints, for a task that shows its output. */
  preview: Preview | null;
  onAsk: () => void;
  onContinue: () => void;
}

/** A task after its answer: how it went, and what it practised. */
const Answered = ({
  problem,
  finished,
  text,
  preview,
  onAsk,
  onContinue,
}: AnsweredProps) => {
  const fromSolution = finished.solution !== null;

  return (
    <SessionBody
      footer={
        <SessionActions
          start={<Button onClick={onAsk}>Why does this work?</Button>}
        >
          <Button variant="primary" onClick={onContinue}>
            Continue ↵
          </Button>
        </SessionActions>
      }
    >
      <Strip problem={problem} />
      {problem.check?.type === "value" && (
        <Shown preview={null} problem={problem} />
      )}
      <CodeBlock code={text.trimEnd()} lineNumbers />
      {problem.check?.type === "command" && (
        <RunPanels>
          <OutputPanel
            empty="Nothing was printed."
            label={fromSolution ? "Output of the solution" : "Your output"}
            state={preview && !fromSolution ? stateOf(preview) : undefined}
            text={printed(preview)}
          />
        </RunPanels>
      )}
      <SessionNote>
        <b>{verdict(finished)}</b>
      </SessionNote>
      <Practised result={finished.result} />
    </SessionBody>
  );
};

interface HelpProps {
  mode: Mode;
  /** True when the task has a lesson the learner may open. */
  hasLesson: boolean;
  reading: boolean;
  busy: boolean;
  onToggleLesson: () => void;
  onHint: () => void;
  onGiveUp: () => void;
}

/** The small buttons under a task: the lesson, a hint, and a way out. */
const Help = ({
  mode,
  hasLesson,
  reading,
  busy,
  onToggleLesson,
  onHint,
  onGiveUp,
}: HelpProps) => (
  <SessionHelp>
    {hasLesson && (
      <Button
        aria-pressed={reading}
        icon={BookOpen}
        title={
          mode === "solo" ? "Opening the lesson counts as help" : undefined
        }
        onClick={onToggleLesson}
      >
        {reading ? "Back to the task" : "Open the lesson"}
      </Button>
    )}
    <Button onClick={onHint}>Hint</Button>
    <Button disabled={busy} onClick={onGiveUp}>
      {mode === "guided" ? "I don't know" : "Give up"}
    </Button>
  </SessionHelp>
);

interface TaskProps {
  problem: Problem;
  mode: Mode;
  /** The lesson a learning task belongs to. A review has none: nothing names its concept. */
  lesson: Lesson | null;
  onAskTutor: () => void;
  /** Called once, when the task is solved or given up. */
  onFinished: (finished: Finished) => void;
  /** The learner read the result and goes on. */
  onContinue: () => void;
}

/**
 * One task of a session: what to do, what the answer does, and the editor at the foot.
 * Once it is answered, the same screen shows how it went and what it practised.
 */
export const Task = ({
  problem,
  mode,
  lesson,
  onAskTutor,
  onFinished,
  onContinue,
}: TaskProps) => {
  const { slug } = problem;
  const short = isShort(problem);
  const [finished, setFinished] = useState<Finished | null>(null);
  const [reading, setReading] = useState(false);

  const answer = useAnswer({
    delay: SAVE_DELAY_MS,
    live: problem.check?.type === "command",
    onFinished: (done) => {
      setFinished(done);
      onFinished(done);
    },
    // A short answer's last result no longer describes the text once it changes.
    resetOnEdit: short,
    slug,
  });

  useEnter(onContinue, finished !== null);

  const { busy, code, edit, preview, run } = answer;

  if (!code) {
    return <SessionBody>{null}</SessionBody>;
  }

  const ask = (what: string) => {
    onAskTutor();
    window.tp.tutor.notify(what);
  };

  if (finished) {
    return (
      <Answered
        finished={finished}
        preview={preview}
        problem={problem}
        text={answer.solution ?? answer.handedIn ?? ""}
        onAsk={() =>
          ask("The learner asked why the answer to this task works.")
        }
        onContinue={onContinue}
      />
    );
  }

  const submit = () => {
    void answer.submit();
  };

  const help = (
    <Help
      busy={busy}
      hasLesson={Boolean(lesson?.parts.length)}
      mode={mode}
      reading={reading}
      onGiveUp={() => {
        void answer.giveUp();
      }}
      onHint={() => ask("The learner asked for a hint on this task.")}
      onToggleLesson={() => {
        // Opening the lesson on a task done alone counts as help.
        if (!reading && mode === "solo" && lesson) {
          void engine("lesson.peek", { concept: lesson.id });
        }

        setReading((r) => !r);
      }}
    />
  );

  const editor = (
    <CodeEditor
      card
      compact={short}
      file={
        short
          ? "answer"
          : `${slug}.${EXTENSIONS.get(code.language) ?? code.language}`
      }
      initialValue={short ? code.text.trimEnd() : code.text}
      key={slug}
      language={code.language}
      readOnly={!code.editable}
      status={
        <>
          <span className="tp-editor-status__note">
            {NOTES[problem.check?.type ?? "function"]}
          </span>
          <IconButton
            disabled={busy}
            icon={ArrowUp}
            label="Submit"
            onClick={submit}
          />
        </>
      }
      onChange={edit}
      onSave={() => {
        if (!short) {
          void answer.test();
        }
      }}
      onSubmit={submit}
    />
  );

  const text = reading && lesson && (
    <LessonText text={lessonText(lesson)} title={lesson.name} />
  );

  // A short answer sits at the foot, under what it prints. A long one takes the room, so
  // the help and the test results stay just above it, always in view.
  if (short) {
    return (
      <SessionBody footer={editor}>
        <Strip problem={problem} />
        {help}
        {text || (
          <>
            <Shown preview={preview} problem={problem} />
            <Checked problem={problem} run={run} />
          </>
        )}
      </SessionBody>
    );
  }

  return (
    <SessionBody
      footer={
        <>
          {help}
          <Checked problem={problem} run={run} />
          {editor}
        </>
      }
      grow
    >
      {text || <Strip problem={problem} />}
    </SessionBody>
  );
};
