import { AppShell, Badge, Rail, RailDivider, RailItem } from "@tech-prep/ui";
import { CalendarCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { engine } from "./course";
import { ExerciseScreen } from "./exercise";
import { LessonScreen } from "./lesson";
import { Lessons } from "./lessons";
import { ReviewSession, ReviewsScreen } from "./reviews";
import { Tutor } from "./tutor";
import type { Course, Reviews, Session } from "./types";

/** What the main pane shows. */
type View =
  | { kind: "lesson"; id: string }
  /** The list of what is due, per track. */
  | { kind: "reviews" }
  /** A review session in progress. */
  | { kind: "review"; planned: number };

export const App = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View | null>(null);
  /** Chapters the learner opened. */
  const [open, setOpen] = useState<Set<string>>(new Set());
  /** The current chapter, when the learner closed it. */
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [tutorOpen, setTutorOpen] = useState(false);

  const refresh = useCallback(() => {
    const load = async () => {
      const [nextCourse, nextSession] = await Promise.all([
        engine<Course>("course"),
        engine<Session>("session"),
      ]);

      setCourse(nextCourse);
      setSession(nextSession);

      // On start, go back to what was open: a review, or the lesson the learner was on.
      setView((current) => {
        if (current) {
          return current;
        }

        if (nextSession.attempt?.mode === "review") {
          return { kind: "review", planned: 1 };
        }

        const id =
          nextSession.attempt?.lesson ??
          nextCourse.next_lesson ??
          nextCourse.topics[0]?.lessons[0]?.id;

        return id ? { id, kind: "lesson" } : { kind: "reviews" };
      });
    };

    void load();
  }, []);

  useEffect(() => {
    refresh();

    return window.tp.onEngineChanged(refresh);
  }, [refresh]);

  const lessonId = view?.kind === "lesson" ? view.id : null;

  // The chapter of the lesson on screen is open unless the learner closed it.
  const currentTopic = course?.topics.find((t) =>
    t.lessons.some((l) => l.id === lessonId)
  )?.id;

  const openTopics =
    currentTopic && !closed.has(currentTopic)
      ? new Set([...open, currentTopic])
      : open;

  const toggleTopic = (topic: string) => {
    const flip = (all: Set<string>) => {
      const next = new Set(all);

      if (!next.delete(topic)) {
        next.add(topic);
      }

      return next;
    };

    // The current chapter is open by default, so closing it is what gets remembered.
    if (topic === currentTopic) {
      setClosed(flip);
    } else {
      setOpen(flip);
    }
  };

  const select = useCallback((id: string) => {
    setView({ id, kind: "lesson" });
  }, []);

  const startReviews = useCallback(() => {
    const start = async () => {
      const reviews = await engine<Reviews>("reviews");
      setView({ kind: "review", planned: reviews.problems });
    };

    void start();
  }, []);

  // Cmd+L opens the tutor and puts the cursor in it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.metaKey &&
        !e.shiftKey &&
        !e.altKey &&
        e.key.toLowerCase() === "l"
      ) {
        e.preventDefault();
        setTutorOpen(true);
        requestAnimationFrame(() =>
          window.dispatchEvent(new Event("tp:focus-tutor"))
        );
      }
    };

    window.addEventListener("keydown", onKey, true);

    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  if (!course || !session || !view) {
    return null;
  }

  const openTutor = () => setTutorOpen(true);
  const toggleTutor = () => setTutorOpen((o) => !o);
  const inLesson = view.kind === "lesson";
  const lessons = course.topics.flatMap((t) => t.lessons);
  const shown = lessons.find((l) => l.id === lessonId);
  // The lesson after the one on screen, for "Next lesson".
  const after = lessons[lessons.findIndex((l) => l.id === lessonId) + 1];

  let pane = null;

  if (session.exercise) {
    // The tutor put an extra exercise on screen. It stays until the learner closes it.
    pane = (
      <ExerciseScreen
        exercise={session.exercise}
        tutorOpen={tutorOpen}
        onChanged={refresh}
        onOpenTutor={openTutor}
        onToggleTutor={toggleTutor}
      />
    );
  } else if (view.kind === "lesson") {
    pane = (
      <LessonScreen
        id={view.id}
        key={view.id}
        next={course.next_lesson ?? after?.id ?? null}
        tutorOpen={tutorOpen}
        onChanged={refresh}
        onOpenTutor={openTutor}
        onSelect={select}
        onToggleTutor={toggleTutor}
      />
    );
  } else if (view.kind === "reviews") {
    pane = (
      <ReviewsScreen
        tutorOpen={tutorOpen}
        onStart={startReviews}
        onToggleTutor={toggleTutor}
      />
    );
  } else {
    pane = (
      <ReviewSession
        nextLesson={course.next_lesson}
        planned={view.planned}
        track={course.subject.name}
        tutorOpen={tutorOpen}
        onChanged={refresh}
        onEnd={() => setView({ kind: "reviews" })}
        onOpenLesson={select}
        onOpenTutor={openTutor}
        onToggleTutor={toggleTutor}
      />
    );
  }

  return (
    <AppShell
      nav={
        inLesson ? (
          <Lessons
            course={course}
            open={openTopics}
            selected={lessonId}
            onSelect={select}
            onToggle={toggleTopic}
          />
        ) : undefined
      }
      rail={
        <Rail>
          <RailItem
            active={!inLesson}
            count={course.due || undefined}
            label="Reviews"
            onClick={() => {
              // A review in progress stays open; leaving it is done with "End reviews".
              if (view.kind !== "review") {
                setView({ kind: "reviews" });
              }
            }}
          >
            <CalendarCheck size={16} />
          </RailItem>
          <RailDivider />
          <RailItem
            active={inLesson}
            label={course.subject.name}
            onClick={() => {
              const id = course.next_lesson ?? lessons[0]?.id;

              if (!inLesson && view.kind !== "review" && id) {
                select(id);
              }
            }}
          >
            <Badge active={inLesson} initials={course.subject.initials} />
          </RailItem>
        </Rail>
      }
      tutor={
        <Tutor
          // A review's problem is not named to the tutor pane's header either way; the lesson's name is.
          context={view.kind === "review" ? "Review" : shown?.name}
          onClose={() => setTutorOpen(false)}
        />
      }
      tutorOpen={tutorOpen}
    >
      {pane}
    </AppShell>
  );
};
