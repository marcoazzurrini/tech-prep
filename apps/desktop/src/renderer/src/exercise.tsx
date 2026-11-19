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
import { useState } from "react";

import { engine } from "./course";
import type { Exercise, Submission } from "./types";

const KIND = {
  answer: "open answer",
  arrange: "arrange the lines",
  example: "example",
  predict: "predict the output",
};

/** The learner's earlier arrangement, if they already handed one in. */
const savedOrder = (exercise: Exercise): string[] | null => {
  if (exercise.kind !== "arrange" || !exercise.response) {
    return null;
  }

  // SAFETY: the engine stores an arrange response as the JSON list of lines it was sent.
  return JSON.parse(exercise.response) as string[];
};

/** What the tutor needs to know about a handed-in exercise. */
const report = ({ exercise, result }: Submission): string => {
  const head = `Exercise ${exercise.id} (${KIND[exercise.kind]}) was submitted.`;

  if (result.status === "submitted") {
    return `${head} Their answer:\n\n${exercise.response}\n\nGrade it with grade_answer.`;
  }

  const answer =
    exercise.kind === "arrange"
      ? `Their order:\n${(savedOrder(exercise) ?? []).join("\n")}`
      : `They answered: ${exercise.response}. The code prints: ${String(exercise.correct_answer)}.`;

  const effects = (result.concepts ?? [])
    .map((c) => `${c.name}: ${c.result} (${c.effect})`)
    .join("; ");

  return `${head} Result: ${result.correct ? "right" : "wrong"}. ${answer}\n${effects}`;
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

const Result = ({ exercise }: { exercise: Exercise }) => {
  if (exercise.status === "submitted") {
    return (
      <ResultCard title="With the tutor" tone="amber">
        The tutor is reading your answer.
      </ResultCard>
    );
  }

  if (exercise.status !== "graded") {
    return null;
  }

  const tone = exercise.correct ? "green" : "red";
  const note = effects(exercise);

  if (exercise.kind === "predict") {
    return (
      <ResultCard
        note={note}
        title={`It prints ${String(exercise.correct_answer)}`}
        tone={tone}
      />
    );
  }

  if (exercise.kind === "arrange") {
    return (
      <ResultCard
        note={note}
        title={exercise.correct ? "In order" : "Not in order"}
        tone={tone}
      >
        {!exercise.correct && Array.isArray(exercise.correct_answer) && (
          <>
            An order that works:
            <pre>{exercise.correct_answer.join("\n")}</pre>
          </>
        )}
      </ResultCard>
    );
  }

  const passed = exercise.concepts.filter((c) => c.result === "pass").length;

  return (
    <ResultCard
      note={note}
      title={`${passed} of ${exercise.concepts.length} points covered`}
      tone={passed === exercise.concepts.length ? "green" : "red"}
    >
      A complete answer:
      <pre>{String(exercise.correct_answer)}</pre>
    </ResultCard>
  );
};

interface AnswerAreaProps {
  exercise: Exercise;
  answer: string;
  onAnswer: (answer: string) => void;
  order: string[];
  spare: string[];
  onArrange: (order: string[], spare: string[]) => void;
}

/** Where the learner answers: a short box, the lines to arrange, or a text box. */
const AnswerArea = ({
  exercise,
  answer,
  onAnswer,
  order,
  spare,
  onArrange,
}: AnswerAreaProps) => {
  const open = exercise.status === "open";

  if (exercise.kind === "arrange") {
    return (
      <Arranger
        disabled={!open}
        lines={order}
        spare={spare}
        onChange={onArrange}
      />
    );
  }

  if (exercise.kind === "predict") {
    let tone: "green" | "red" | undefined;

    if (exercise.correct !== null) {
      tone = exercise.correct ? "green" : "red";
    }

    return (
      <PaneSection label="Your answer">
        <AnswerInput
          aria-label="Your answer"
          disabled={!open}
          tone={tone}
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
        />
      </PaneSection>
    );
  }

  if (exercise.kind === "answer") {
    return (
      <PaneSection label="Your answer">
        <AnswerText
          aria-label="Your answer"
          disabled={!open}
          placeholder="In your own words…"
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
        />
      </PaneSection>
    );
  }

  return null;
};

interface ExercisePaneProps {
  exercise: Exercise;
  /** Called after the learner hands in, so the app reloads its state. */
  onChanged: () => void;
  /** Open the tutor pane, for when the learner asks for a hint. */
  onAskTutor: () => void;
}

/** One tutor-made exercise: the task, the answer area, and the result once it is handed in. */
export const ExercisePane = ({
  exercise,
  onChanged,
  onAskTutor,
}: ExercisePaneProps) => {
  const [answer, setAnswer] = useState(
    exercise.kind === "arrange" ? "" : (exercise.response ?? "")
  );

  const [order, setOrder] = useState(
    savedOrder(exercise) ?? exercise.lines ?? []
  );

  const [spare, setSpare] = useState(
    (exercise.lines ?? []).filter(
      (line) => savedOrder(exercise)?.includes(line) === false
    )
  );

  const [sending, setSending] = useState(false);
  const open = exercise.status === "open";
  const filled = exercise.kind === "arrange" || answer.trim() !== "";

  const submit = async () => {
    setSending(true);

    try {
      const submission = await engine("exercise.submit", {
        id: exercise.id,
        response: exercise.kind === "arrange" ? order : answer.trim(),
      });

      window.tp.tutor.notify(report(submission));
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

  if (exercise.kind === "example") {
    return (
      <PaneBody>
        <TaskHeader
          chips={<Chips exercise={exercise} />}
          description={exercise.prompt}
          title={exercise.title}
        />
        {exercise.code && <CodeBlock code={exercise.code} />}
      </PaneBody>
    );
  }

  return (
    <>
      <PaneBody>
        <TaskHeader
          chips={<Chips exercise={exercise} />}
          description={exercise.prompt}
          title={exercise.title}
        />
        {exercise.code && <CodeBlock code={exercise.code} />}
        <AnswerArea
          answer={answer}
          exercise={exercise}
          order={order}
          spare={spare}
          onAnswer={setAnswer}
          onArrange={(nextOrder, nextSpare) => {
            setOrder(nextOrder);
            setSpare(nextSpare);
          }}
        />
        {!open && (
          <PaneSection>
            <Result exercise={exercise} />
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
          disabled={!open || !filled || sending}
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
