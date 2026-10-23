import { Chapter, CourseHeader, CourseNav, Lesson } from "@tech-prep/ui";
import type { LessonStatus } from "@tech-prep/ui";

import { DIFFICULTY, dueCount, isOpen } from "./course";
import type { ProblemStatus, Roadmap } from "./types";

type Topic = Roadmap["topics"][number];

const STATUS: Record<ProblemStatus, LessonStatus> = {
  attempted: "started",
  in_progress: "started",
  solved: "done",
  solved_with_help: "partial",
  unattempted: "todo",
};

interface LessonsProps {
  subject: string;
  roadmap: Roadmap;
  /** The problem the tutor is on. */
  current: string | null;
  /** The problem in the main pane. */
  selected: string | null;
  open: Set<string>;
  onToggle: (topic: string) => void;
  onSelect: (slug: string) => void;
}

/** The subject's topics as chapters and its problems as lessons. */
export const Lessons = ({
  subject,
  roadmap,
  current,
  selected,
  open,
  onToggle,
  onSelect,
}: LessonsProps) => {
  const solved = roadmap.topics.reduce((sum, t) => sum + t.solved, 0);
  const total = roadmap.topics.reduce((sum, t) => sum + t.total, 0);
  const due = dueCount(roadmap);

  const chapter = (t: Topic, i: number) => (
    <Chapter
      current={t.id === roadmap.current}
      done={t.total > 0 && t.solved === t.total}
      key={t.id}
      label={`${i + 1}  ${t.name}`}
      meta={`${t.solved} / ${t.total}`}
      open={open.has(t.id)}
      onToggle={() => onToggle(t.id)}
    >
      {t.problems.map((p) => (
        <Lesson
          current={p.slug === current}
          key={p.slug}
          label={p.title}
          meta={DIFFICULTY[p.difficulty]}
          selected={p.slug === selected}
          status={isOpen(p) ? STATUS[p.status] : "locked"}
          onSelect={() => onSelect(p.slug)}
        />
      ))}
    </Chapter>
  );

  return (
    <CourseNav
      header={
        <CourseHeader
          meta={`${solved} of ${total} problems solved${due ? ` · ${due} due today` : ""}`}
          progress={total ? solved / total : 0}
          title={subject}
        />
      }
    >
      {roadmap.topics.map(chapter)}
    </CourseNav>
  );
};
