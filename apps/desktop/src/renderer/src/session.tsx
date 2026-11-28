import {
  Button,
  Figures,
  Hero,
  HeroNote,
  LessonText,
  SessionActions,
  SessionBar,
  SessionBody,
  SessionPane,
} from "@tech-prep/ui";
import { Check, RotateCcw, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { engine, useEnter } from "./course";
import { ExercisePane } from "./exercise";
import { contextOf, count, EMPTY, partOf } from "./session-flow";
import type { Step } from "./session-flow";
import { Task } from "./task";
import type { Exercise } from "./types";

/** How often the time left is drawn again. */
const TICK_MS = 15_000;
const MINUTE_MS = 60_000;

/** Why the session ended, as the summary says it. */
const ENDINGS = {
  empty: "Nothing is left for today in this course.",
  ended: "You ended the session.",
  time: "Your time is up.",
};

/**
 * What comes next in the course: the reviews that are due, then the next concept. A concept
 * is taught a part at a time: its text first, then its task. Parts already read in this
 * session are not shown twice.
 */
const nextStep = async (course: string, read: Set<string>): Promise<Step> => {
  const review = await engine("review.next", { course });

  if (review.problem) {
    return {
      kind: "task",
      lesson: null,
      mode: "review",
      problem: review.problem,
    };
  }

  const { next_lesson: next } = await engine("course");

  if (!next) {
    return { kind: "done", why: "empty" };
  }

  const lesson = await engine("lesson.open", { concept: next });

  if (!lesson.attempt) {
    return { kind: "done", why: "empty" };
  }

  if (lesson.step === 2) {
    return { kind: "task", lesson, mode: "solo", problem: lesson.solo };
  }

  const part = partOf(lesson);

  return read.has(`${lesson.id}:${part}`)
    ? { kind: "task", lesson, mode: "guided", problem: lesson.guided }
    : { kind: "see", lesson, part };
};

const BLOCKS = {
  done: { icon: Check, label: "Done" },
  guided: { icon: Sparkles, label: "New concept" },
  review: { icon: RotateCcw, label: "Review" },
  solo: { icon: User, label: "On your own" },
};

/** The block a step belongs to, named in the top bar. */
const blockOf = (step: Step) => {
  if (step.kind === "task") {
    return BLOCKS[step.mode];
  }

  return step.kind === "see" ? BLOCKS.guided : BLOCKS.done;
};

const plural = (n: number, word: string): string =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

interface SessionScreenProps {
  /** The course the session is in. */
  course: string;
  /** When the session started, in milliseconds. */
  started: number;
  /** How long the learner chose to study, in minutes. */
  minutes: number;
  /** An extra exercise the tutor put on screen. It covers the session until it is closed. */
  exercise: Exercise | null;
  tutorOpen: boolean;
  onToggleTutor: () => void;
  onOpenTutor: () => void;
  /** Called when progress changed, so the app reloads its state. */
  onChanged: () => void;
  /** Tells the app what the tutor pane's header should say. */
  onContext: (context: string) => void;
  /** Leave the session: back to Today. */
  onEnd: () => void;
}

/**
 * A session: one thing on screen at a time, for as long as the learner chose. The time
 * plans, it never cuts: the task on screen is always finished, then the session ends.
 */
export const SessionScreen = ({
  course,
  started,
  minutes,
  exercise,
  tutorOpen,
  onToggleTutor,
  onOpenTutor,
  onChanged,
  onContext,
  onEnd,
}: SessionScreenProps) => {
  const [step, setStep] = useState<Step | null>(null);
  /** Counts the steps shown, so each task gets an answer area of its own. */
  const [turn, setTurn] = useState(0);
  const [tally, setTally] = useState(EMPTY);
  const [now, setNow] = useState(started);
  const read = useRef(new Set<string>());

  const advance = useCallback(async () => {
    const next = await nextStep(course, read.current);

    setStep(next);
    setTurn((t) => t + 1);
    setNow(Date.now());
    onContext(contextOf(next));
    onChanged();
  }, [course, onChanged, onContext]);

  useEffect(() => {
    void advance();
  }, [advance]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), TICK_MS);

    return () => clearInterval(timer);
  }, []);

  const used = (now - started) / (minutes * MINUTE_MS);

  /** Go on after a task: to the next one, or to the summary once the time is used. */
  const proceed = useCallback(() => {
    if (Date.now() - started >= minutes * MINUTE_MS) {
      setStep({ kind: "done", why: "time" });
    } else {
      void advance();
    }
  }, [advance, minutes, started]);

  /** The learner read a part: its task comes next. */
  const seen = useCallback(() => {
    if (step?.kind === "see") {
      read.current.add(`${step.lesson.id}:${step.part}`);
      void advance();
    }
  }, [advance, step]);

  useEnter(step?.kind === "done" ? onEnd : seen, step?.kind !== "task");

  if (!step) {
    return <SessionPane>{null}</SessionPane>;
  }

  /** Stop before the time is up. The task on screen is set aside with no grade. */
  const end = async () => {
    if (step.kind === "task") {
      await engine("attempt.pause", { slug: step.problem.slug });
    }

    onChanged();

    if (tally.tasks) {
      setStep({ kind: "done", why: "ended" });
    } else {
      onEnd();
    }
  };

  const left = Math.max(0, Math.ceil(minutes * (1 - used)));

  const bar = (
    <SessionBar
      actions={
        step.kind !== "done" && (
          <Button
            variant="ghost"
            onClick={() => {
              void end();
            }}
          >
            End session
          </Button>
        )
      }
      block={blockOf(step)}
      time={{
        label: step.kind === "done" ? `${minutes} min` : `${left} min left`,
        used: step.kind === "done" ? 1 : used,
      }}
      tutorOpen={tutorOpen}
      onToggleTutor={onToggleTutor}
    />
  );

  if (exercise) {
    return (
      <SessionPane>
        {bar}
        <ExercisePane
          exercise={exercise}
          key={exercise.id}
          onAskTutor={onOpenTutor}
          onChanged={onChanged}
        />
      </SessionPane>
    );
  }

  if (step.kind === "done") {
    const [first] = tally.learned;
    const spent = Math.max(1, Math.round(minutes * Math.min(1, used)));

    return (
      <SessionPane>
        {bar}
        <SessionBody
          centred
          footer={
            <SessionActions centred>
              <Button variant="primary" onClick={onEnd}>
                Finish ↵
              </Button>
            </SessionActions>
          }
        >
          <Hero lead={ENDINGS[step.why]} title="Done." />
          <Figures
            items={[
              { label: spent === 1 ? "minute" : "minutes", value: spent },
              {
                label:
                  tally.learned.length === 1 ? "new concept" : "new concepts",
                value: tally.learned.length,
              },
              {
                label:
                  tally.reviewed === 1
                    ? "concept reviewed"
                    : "concepts reviewed",
                value: tally.reviewed,
              },
              {
                label: "right first time",
                value: `${tally.firstTime} of ${tally.tasks}`,
              },
            ]}
            large
          />
          {first && (
            <HeroNote>
              {tally.learned.length === 1
                ? `${first} comes back tomorrow, inside a review.`
                : `${plural(tally.learned.length, "new concept")} come back tomorrow, inside reviews.`}
            </HeroNote>
          )}
        </SessionBody>
      </SessionPane>
    );
  }

  if (step.kind === "see") {
    const part = step.lesson.parts[step.part];

    return (
      <SessionPane>
        {bar}
        <SessionBody
          footer={
            <SessionActions>
              <Button variant="primary" onClick={seen}>
                Continue ↵
              </Button>
            </SessionActions>
          }
        >
          <LessonText
            key={`${step.lesson.id}:${step.part}`}
            text={part?.text ?? ""}
            title={part?.title ?? step.lesson.name}
          />
        </SessionBody>
      </SessionPane>
    );
  }

  return (
    <SessionPane>
      {bar}
      <Task
        key={turn}
        lesson={step.lesson}
        mode={step.mode}
        problem={step.problem}
        onAskTutor={onOpenTutor}
        onContinue={proceed}
        onFinished={(done) => {
          setTally((t) => count(t, step, done));
          onChanged();
        }}
      />
    </SessionPane>
  );
};
