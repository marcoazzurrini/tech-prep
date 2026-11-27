// A lesson as the learner goes through it: its text in parts, each beside one guided task,
// then the tasks to solve alone. The rules for what opens next live here, so the app only
// shows what it is given.

import { concept, guidedSlugs, lessonText, soloSlugs } from "./content.ts";
import type { Course } from "./content.ts";
import type { AttemptRow, Outcome } from "./db.ts";
import { hasLesson } from "./exercises.ts";
import { startProblem } from "./practice.ts";
import {
  isOpen,
  lessonStatus,
  lessonStep,
  problemStatus,
  soloWait,
} from "./scheduler.ts";

/**
 * The line that ends a part of a lesson. A lesson with several guided tasks is written in
 * parts: the text before the first marker goes with the first task, and so on. What follows
 * the last marker is the lesson's summary.
 */
export const TASK_MARKER = "<!-- task -->";

/** One part of a lesson: one idea, shown alone beside its guided task. */
export interface LessonPart {
  /** Its name on the trail in the top bar. */
  name: string;
  /** The heading above its text. */
  title: string;
  text: string;
  /** The guided task that goes with it. */
  task: string;
}

const HEADING = /^## (?<name>.+)$/mu;
const TITLE_LINE = /^# .*\n/u;

/**
 * A lesson's parts, one per guided task. A part is named by its first "## " heading. A part
 * that opens with its heading is headed by it. A first part that opens with other text is
 * headed by the lesson's name. The summary closes the last part. A lesson that is not split
 * has one part.
 * Empty when the lesson is not written.
 */
export const lessonParts = (course: Course, id: string): LessonPart[] => {
  const whole = lessonText(course, id);
  const slugs = guidedSlugs(course, id);
  const [first] = slugs;
  const { name: lesson } = concept(course, id);

  if (whole === null || !first) {
    return [];
  }

  const pieces = whole.split(TASK_MARKER).map((piece) => piece.trim());

  if (slugs.length < 2 || pieces.length < slugs.length) {
    return [
      { name: lesson, task: first, text: pieces.join("\n\n"), title: lesson },
    ];
  }

  const summary = pieces.slice(slugs.length).join("\n\n");

  return slugs.map((task, i) => {
    const piece = pieces[i] ?? "";
    const name = HEADING.exec(piece)?.groups?.name?.trim();

    // The lesson's own title line is the page's to show.
    const body = (i === slugs.length - 1 ? `${piece}\n\n${summary}` : piece)
      .replace(TITLE_LINE, "")
      .trim();

    const headed = name !== undefined && body.startsWith("## ");

    return {
      name: name ?? `Part ${i + 1}`,
      task,
      text: (headed ? body.slice(body.indexOf("\n") + 1) : body).trim(),
      title: headed ? name : lesson,
    };
  });
};

/** A step's tasks: the one to do now, and how far the learner is. */
export interface Progress {
  current: string;
  done: number;
  total: number;
}

const progress = (
  slugs: string[],
  done: (slug: string) => boolean
): Progress => {
  const at = slugs.findIndex((s) => !done(s));
  const current = slugs.at(at) ?? slugs[0];

  if (!current) {
    throw new Error("A lesson step has no task.");
  }

  return {
    current,
    done: at === -1 ? slugs.length : at,
    total: slugs.length,
  };
};

/** A lesson's guided tasks: one counts as done once it is solved, with or without help. */
export const guidedProgress = (course: Course, id: string): Progress =>
  progress(guidedSlugs(course, id), (s) =>
    ["solved", "solved_with_help"].includes(problemStatus(course, s))
  );

/** A lesson's solo tasks: one counts as done only when it is solved alone. */
export const soloProgress = (course: Course, id: string): Progress =>
  progress(soloSlugs(course, id), (s) => problemStatus(course, s) === "solved");

/**
 * Start work on a lesson: its guided task in step 1, its solo task in step 2. Nothing
 * starts on a lesson that is locked or not written, on a solo task that waits after a
 * struggle, or on a lesson already learned unless the learner asked to `practise` it.
 */
export const startLesson = (
  course: Course,
  id: string,
  practise: boolean
): void => {
  const learned = lessonStatus(course, id) === "done";

  if (!hasLesson(course, id) || !isOpen(course, id) || (learned && !practise)) {
    return;
  }

  if (lessonStep(course, id) === 1) {
    startProblem(course, guidedProgress(course, id).current, "guided");
  } else if (soloWait(course, id) === null) {
    startProblem(course, soloProgress(course, id).current, "solo");
  }
};

/**
 * True when the app opens the next task by itself after an attempt ended. A right answer
 * moves on. What stays on screen has something to read: a solution after giving up, or a
 * solo task that needed help. The last solo task opens no task of its lesson: when it makes
 * the lesson learned, the app opens the next lesson.
 */
export const movesOn = (
  course: Course,
  attempt: AttemptRow,
  lesson: string | null,
  outcome: Outcome
): boolean => {
  if (attempt.mode === "guided") {
    return outcome === "solved" || outcome === "solved_with_help";
  }

  if (outcome !== "solved") {
    return false;
  }

  return attempt.mode === "solo" && lesson
    ? soloProgress(course, lesson).done < soloProgress(course, lesson).total
    : attempt.mode === "review";
};
