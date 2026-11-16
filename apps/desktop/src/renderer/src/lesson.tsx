import {
  Chip,
  EmptyState,
  LessonPane,
  PaneBody,
  ProblemStatement,
  TaskHeader,
  TopBar,
} from "@tech-prep/ui";
import { Lock } from "lucide-react";

import { DIFFICULTY, isOpen } from "./course";
import { ExercisePane } from "./exercise";
import type { Exercise, Problem, Roadmap, Session } from "./types";
import { Workbench } from "./workbench";

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

/** Learn, Review or Practise, for the problem the tutor is on. */
const phaseOf = (session: Session, problem: Problem) => {
  const review = session.attempt
    ? session.attempt.phase === "review"
    : session.next.action === "review";

  if (review) {
    return "Review";
  }

  return problem.new_concepts.length > 0 ? "Learn" : "Practise";
};

interface ChipsProps {
  problem: Problem;
  phase: string | null;
}

/** Difficulty, the phase when the tutor is on this problem, and what it teaches. */
const LessonChips = ({ problem, phase }: ChipsProps) => {
  const concepts = `${problem.concept_count} concept${problem.concept_count === 1 ? "" : "s"}`;

  return (
    <>
      <Chip muted>{DIFFICULTY[problem.difficulty]}</Chip>
      {phase ? (
        <Chip>{phase}</Chip>
      ) : (
        <Chip muted>Preview · the tutor is on another problem</Chip>
      )}
      {phase === "Learn" && <Chip>New: {problem.new_concepts.join(", ")}</Chip>}
      {phase === "Review" && (
        <Chip icon={Lock} muted>
          {concepts} · revealed when you finish
        </Chip>
      )}
    </>
  );
};

interface LessonViewProps {
  session: Session;
  roadmap: Roadmap;
  /** The problem to show; null when there is nothing to do. */
  problem: Problem | null;
  tutorOpen: boolean;
  onToggleTutor: () => void;
  onOpenTutor: () => void;
  onSelect: (slug: string) => void;
}

interface ExerciseLessonProps {
  exercise: Exercise;
  /** The chapter the exercise belongs to, if it is part of a lesson. */
  chapter?: string;
  tutorOpen: boolean;
  onToggleTutor: () => void;
  onOpenTutor: () => void;
  /** Called after the learner hands in, so the app reloads its state. */
  onChanged: () => void;
}

/** The main pane while the tutor's exercise is on screen. */
export const ExerciseLesson = ({
  exercise,
  chapter,
  tutorOpen,
  onToggleTutor,
  onOpenTutor,
  onChanged,
}: ExerciseLessonProps) => (
  <LessonPane>
    <TopBar
      chapter={chapter ?? "Review"}
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

/** What to say when there is no problem to show. */
const idleText = (next: Session["next"]): string => {
  if (next.action === "review_exercise") {
    return "The tutor is writing your next exercise.";
  }

  return next.action === "done_for_now" && next.next_due
    ? `Your next review is on ${formatDate(next.next_due)}.`
    : next.why;
};

interface IdleLessonProps {
  next: Session["next"];
  tutorOpen: boolean;
  onToggleTutor: () => void;
}

/** The main pane when there is no problem to show. */
const IdleLesson = ({ next, tutorOpen, onToggleTutor }: IdleLessonProps) => (
  <LessonPane>
    <TopBar
      chapter="Today"
      lesson={next.action === "review_exercise" ? "Review" : "All done"}
      tutorOpen={tutorOpen}
      onToggleTutor={onToggleTutor}
    />
    <PaneBody>
      <EmptyState
        title={
          next.action === "review_exercise"
            ? "One moment"
            : "Nothing to do right now"
        }
      >
        {idleText(next)}
      </EmptyState>
    </PaneBody>
  </LessonPane>
);

export const LessonView = ({
  session,
  roadmap,
  problem,
  tutorOpen,
  onToggleTutor,
  onOpenTutor,
  onSelect,
}: LessonViewProps) => {
  if (!problem) {
    return (
      <IdleLesson
        next={session.next}
        tutorOpen={tutorOpen}
        onToggleTutor={onToggleTutor}
      />
    );
  }

  const topic = roadmap.topics.find((t) => t.id === problem.topic);

  const open = (topic?.problems ?? []).filter(isOpen);

  const at = open.findIndex((p) => p.slug === problem.slug);
  const previous = at > 0 ? open[at - 1] : undefined;
  const next = at === -1 ? undefined : open[at + 1];
  const index = topic?.problems.findIndex((p) => p.slug === problem.slug) ?? -1;

  const phase =
    problem.slug === session.problem?.slug ? phaseOf(session, problem) : null;

  // The editor opens once the tutor has opened this problem.
  const working = session.attempt?.slug === problem.slug;

  return (
    <LessonPane>
      <TopBar
        chapter={topic?.name ?? problem.topic}
        lesson={problem.title}
        position={
          topic && index >= 0
            ? `Problem ${index + 1} of ${topic.problems.length}`
            : undefined
        }
        tutorOpen={tutorOpen}
        onNext={next && (() => onSelect(next.slug))}
        onPrevious={previous && (() => onSelect(previous.slug))}
        onToggleTutor={onToggleTutor}
      />
      <PaneBody share={working}>
        <TaskHeader
          chips={<LessonChips phase={phase} problem={problem} />}
          title={problem.title}
        />
        {problem.statement ? (
          <ProblemStatement text={problem.statement} />
        ) : (
          <EmptyState title="No statement yet">
            This problem has no statement yet.
          </EmptyState>
        )}
      </PaneBody>
      {working && (
        <Workbench
          key={session.attempt?.id}
          problem={problem}
          onAskTutor={onOpenTutor}
        />
      )}
    </LessonPane>
  );
};
