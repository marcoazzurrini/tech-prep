import { Chapter, CourseHeader, CourseNav, Lesson } from "@tech-prep/ui";

import type { Course } from "./types";

type Topic = Course["topics"][number];

interface LessonsProps {
  course: Course;
  /** The lesson in the main pane. */
  selected: string | null;
  open: Set<string>;
  onToggle: (topic: string) => void;
  onSelect: (lesson: string) => void;
}

/** The course's topics as chapters and its concepts as lessons. */
export const Lessons = ({
  course,
  selected,
  open,
  onToggle,
  onSelect,
}: LessonsProps) => {
  const { concepts, problems } = course;

  const chapter = (t: Topic, i: number) => (
    <Chapter
      current={t.lessons.some((l) => l.id === course.next_lesson)}
      done={t.total > 0 && t.learned === t.total}
      key={t.id}
      label={`${i + 1}  ${t.name}`}
      meta={`${t.learned} / ${t.total}`}
      open={open.has(t.id)}
      onToggle={() => onToggle(t.id)}
    >
      {t.lessons.map((l) => (
        <Lesson
          current={l.id === course.next_lesson}
          key={l.id}
          label={l.name}
          selected={l.id === selected}
          // A lesson that is not written yet cannot be opened.
          status={l.written ? l.status : "locked"}
          onSelect={() => onSelect(l.id)}
        />
      ))}
    </Chapter>
  );

  return (
    <CourseNav
      header={
        <CourseHeader
          meta={`${concepts.learned} of ${concepts.total} concepts · ${problems.solved} of ${problems.total} problems`}
          progress={concepts.total ? concepts.learned / concepts.total : 0}
          title={course.subject.name}
        />
      }
    >
      {course.topics.map(chapter)}
    </CourseNav>
  );
};
