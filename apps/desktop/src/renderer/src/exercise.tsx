import {
  AnswerInput,
  AnswerText,
  Arranger,
  Button,
  Chip,
  CodeBlock,
  LessonPane,
  PaneBody,
  PaneFooter,
  PaneSection,
  ResultCard,
  TaskHeader,
  TopBar,
} from "@tech-prep/ui";
import { Lock } from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";

import { engine } from "./course";
import type { Exercise, Submission } from "./types";

/** What the learner hands in: text, or lines in order. Null while there is nothing to hand in. */
type Response = string | string[] | null;

interface AnswerProps {
  exercise: Exercise;
  response: Response;
  onChange: (response: Response) => void;
}

/** How the app shows one kind of extra exercise. A new checker adds one entry. */
interface Extra {
  /** What the tutor is told the exercise was. */
  name: string;
  /** The code the learner reads, above the answer. */
  code: (exercise: Exercise) => string | null;
  /** Where the learner answers. Left out when there is nothing to answer. */
  Answer?: ComponentType<AnswerProps>;
  /** What the answer area starts with: an answer handed in earlier, or an empty one. */
  start: (exercise: Exercise) => Response;
  /** The verdict, once the engine or the tutor graded it. */
  Verdict: ComponentType<{ exercise: Exercise; note: string }>;
  /** What the tutor is told about the answer that was handed in. */
  answered: (exercise: Exercise) => string;
}

const textOf = (response: Response): string =>
  Array.isArray(response) ? "" : (response ?? "");

/** The lines of an arrange exercise, mixed. */
const linesOf = ({ check }: Exercise): string[] =>
  check.type === "arrange" ? check.lines : [];

/** The learner's earlier arrangement, if they already handed one in. */
const savedOrder = (exercise: Exercise): string[] | null => {
  if (exercise.check.type !== "arrange" || !exercise.response) {
    return null;
  }

  // SAFETY: the engine stores an arrange response as the JSON list of lines it was sent.
  return JSON.parse(exercise.response) as string[];
};

const ValueAnswer = ({ exercise, response, onChange }: AnswerProps) => {
  let tone: "green" | "red" | undefined;

  if (exercise.correct !== null) {
    tone = exercise.correct ? "green" : "red";
  }

  return (
    <PaneSection label="Your answer">
      <AnswerInput
        aria-label="Your answer"
        disabled={exercise.status !== "open"}
        tone={tone}
        value={textOf(response)}
        onChange={(e) => onChange(e.target.value)}
      />
    </PaneSection>
  );
};

const OpenAnswer = ({ exercise, response, onChange }: AnswerProps) => (
  <PaneSection label="Your answer">
    <AnswerText
      aria-label="Your answer"
      disabled={exercise.status !== "open"}
      placeholder="In your own words…"
      value={textOf(response)}
      onChange={(e) => onChange(e.target.value)}
    />
  </PaneSection>
);

const ArrangeAnswer = ({ exercise, response, onChange }: AnswerProps) => {
  const order = Array.isArray(response) ? response : [];

  // The lines set aside keep the order the learner left them in.
  const [spare, setSpare] = useState(
    linesOf(exercise).filter((line) => !order.includes(line))
  );

  return (
    <Arranger
      disabled={exercise.status !== "open"}
      lines={order}
      spare={spare}
      onChange={(nextOrder, nextSpare) => {
        setSpare(nextSpare);
        onChange(nextOrder);
      }}
    />
  );
};

const nothing = () => null;

const EXTRAS: Record<Exercise["check"]["type"], Extra | null> = {
  answer: {
    Answer: OpenAnswer,
    Verdict: ({ exercise, note }) => {
      const passed = exercise.concepts.filter(
        (c) => c.result === "pass"
      ).length;

      return (
        <ResultCard
          note={note}
          title={`${passed} of ${exercise.concepts.length} points covered`}
          tone={passed === exercise.concepts.length ? "green" : "red"}
        >
          A complete answer:
          <pre>{exercise.correct_answer}</pre>
        </ResultCard>
      );
    },
    answered: (exercise) => `Their answer:\n\n${exercise.response}`,
    code: nothing,
    name: "open answer",
    start: (exercise) => exercise.response ?? "",
  },
  arrange: {
    Answer: ArrangeAnswer,
    Verdict: ({ exercise, note }) => (
      <ResultCard
        note={note}
        title={exercise.correct ? "In order" : "Not in order"}
        tone={exercise.correct ? "green" : "red"}
      >
        {!exercise.correct && exercise.correct_answer && (
          <>
            An order that works:
            <pre>{exercise.correct_answer}</pre>
          </>
        )}
      </ResultCard>
    ),
    answered: (exercise) =>
      `Their order:\n${(savedOrder(exercise) ?? []).join("\n")}`,
    code: nothing,
    name: "arrange the lines",
    start: (exercise) => savedOrder(exercise) ?? linesOf(exercise),
  },
  // The tutor does not show these two as extras: they are for a course's own exercises.
  command: null,
  function: null,
  read: {
    Verdict: nothing,
    answered: () => "",
    code: ({ check }) => (check.type === "read" ? check.code : null),
    name: "example",
    start: nothing,
  },
  value: {
    Answer: ValueAnswer,
    Verdict: ({ exercise, note }) => (
      <ResultCard
        note={note}
        title={`It prints ${exercise.correct_answer}`}
        tone={exercise.correct ? "green" : "red"}
      />
    ),
    answered: (exercise) =>
      `They answered: ${exercise.response}. The code prints: ${exercise.correct_answer}.`,
    code: ({ check }) =>
      check.type === "value" ? (check.shown[0]?.text ?? null) : null,
    name: "predict the output",
    start: (exercise) => exercise.response ?? "",
  },
};

/** What the tutor needs to know about a handed-in exercise. */
const report = (extra: Extra, { exercise, result }: Submission): string => {
  const head = `Exercise ${exercise.id} (${extra.name}) was submitted.`;

  if (result.status === "submitted") {
    return `${head} ${extra.answered(exercise)}\n\nGrade it with grade_answer.`;
  }

  const effects = (result.concepts ?? [])
    .map((c) => `${c.name}: ${c.result} (${c.effect})`)
    .join("; ");

  return `${head} Result: ${result.correct ? "right" : "wrong"}. ${extra.answered(exercise)}\n${effects}`;
};

const Chips = ({ exercise }: { exercise: Exercise }) => {
  if (exercise.concepts.length === 0) {
    return (
      <Chip icon={Lock} muted>
        Review · concepts shown when you finish
      </Chip>
    );
  }

  return (
    <>
      {exercise.concepts.map((c) =>
        c.result ? (
          <Chip key={c.id} tone={c.result === "pass" ? "green" : "red"}>
            {c.name} · {c.result === "pass" ? "Right" : "Missed"}
          </Chip>
        ) : (
          <Chip key={c.id} muted>
            {c.name}
          </Chip>
        )
      )}
    </>
  );
};

/** What each concept's result means for the learner's progress. */
const effects = (exercise: Exercise): string =>
  exercise.concepts
    .filter((c) => c.effect)
    .map((c) => `${c.name}: ${c.effect}.`)
    .join(" ");

/** Where an exercise stands once it is handed in: with the tutor, or graded. */
const Outcome = ({ exercise, extra }: { exercise: Exercise; extra: Extra }) => {
  if (exercise.status === "submitted") {
    return (
      <ResultCard title="With the tutor" tone="amber">
        The tutor is reading your answer.
      </ResultCard>
    );
  }

  return exercise.status === "graded" ? (
    <extra.Verdict exercise={exercise} note={effects(exercise)} />
  ) : null;
};

/** True when there is something to hand in. */
const isFilled = (response: Response): boolean =>
  Array.isArray(response) || (response ?? "").trim() !== "";

interface ExercisePaneProps {
  exercise: Exercise;
  /** Called after the learner hands in, so the app reloads its state. */
  onChanged: () => void;
  /** Open the tutor pane, for when the learner asks for a hint. */
  onAskTutor: () => void;
}

/** One extra exercise: the task, the answer area, and the result once it is handed in. */
export const ExercisePane = ({
  exercise,
  onChanged,
  onAskTutor,
}: ExercisePaneProps) => {
  const extra = EXTRAS[exercise.check.type];
  const [response, setResponse] = useState(extra?.start(exercise) ?? null);
  const [sending, setSending] = useState(false);
  const open = exercise.status === "open";

  if (!extra) {
    return null;
  }

  const submit = async () => {
    setSending(true);

    try {
      const submission = await engine("exercise.submit", {
        id: exercise.id,
        response: Array.isArray(response) ? response : (response ?? "").trim(),
      });

      window.tp.tutor.notify(report(extra, submission));
    } catch {
      // The engine refused it, for example a second submit. Reloading shows the real state.
    }

    setSending(false);
    onChanged();
  };

  const hint = () => {
    onAskTutor();
    window.tp.tutor.notify("The learner asked for a hint on this exercise.");
  };

  const code = extra.code(exercise);

  const header = (
    <>
      <TaskHeader
        chips={<Chips exercise={exercise} />}
        description={exercise.prompt}
        title={exercise.title}
      />
      {code && <CodeBlock code={code} />}
    </>
  );

  // Something that is only read has no answer area and no footer.
  if (!extra.Answer) {
    return <PaneBody>{header}</PaneBody>;
  }

  return (
    <>
      <PaneBody>
        {header}
        <extra.Answer
          exercise={exercise}
          response={response}
          onChange={setResponse}
        />
        {!open && (
          <PaneSection>
            <Outcome exercise={exercise} extra={extra} />
          </PaneSection>
        )}
      </PaneBody>
      <PaneFooter
        start={
          open ? undefined : (
            <span className="tp-pane-footer__note">Answered</span>
          )
        }
      >
        {open && <Button onClick={hint}>Show hint</Button>}
        <Button
          disabled={!open || !isFilled(response) || sending}
          variant="primary"
          onClick={() => {
            void submit();
          }}
        >
          Submit
        </Button>
      </PaneFooter>
    </>
  );
};

interface ExerciseScreenProps {
  exercise: Exercise;
  tutorOpen: boolean;
  onToggleTutor: () => void;
  onOpenTutor: () => void;
  /** Called after the learner hands in or closes the exercise, so the app reloads its state. */
  onChanged: () => void;
}

/** The main pane while an extra exercise from the tutor is on screen. */
export const ExerciseScreen = ({
  exercise,
  tutorOpen,
  onToggleTutor,
  onOpenTutor,
  onChanged,
}: ExerciseScreenProps) => {
  const close = async () => {
    await engine("exercise.close");
    onChanged();
  };

  return (
    <LessonPane>
      <TopBar
        actions={
          <Button
            variant="ghost"
            onClick={() => {
              void close();
            }}
          >
            Close exercise
          </Button>
        }
        chapter="Extra practice"
        lesson={exercise.title}
        tutorOpen={tutorOpen}
        onToggleTutor={onToggleTutor}
      />
      <ExercisePane
        exercise={exercise}
        key={exercise.id}
        onAskTutor={onOpenTutor}
        onChanged={onChanged}
      />
    </LessonPane>
  );
};
