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
import type { Problem, Roadmap, Session } from "./types";

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
  onSelect: (slug: string) => void;
}

export const LessonView = ({
  session,
  roadmap,
  problem,
  tutorOpen,
  onToggleTutor,
  onSelect,
}: LessonViewProps) => {
  if (!problem) {
    const { next } = session;

    return (
      <LessonPane>
        <TopBar
          chapter="Today"
          lesson="All done"
          tutorOpen={tutorOpen}
          onToggleTutor={onToggleTutor}
        />
        <PaneBody>
          <EmptyState title="Nothing to do right now">
            {next.action === "done_for_now" && next.next_due
              ? `Your next review is on ${formatDate(next.next_due)}.`
              : next.why}
          </EmptyState>
        </PaneBody>
      </LessonPane>
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
      <PaneBody>
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
    </LessonPane>
  );
};
