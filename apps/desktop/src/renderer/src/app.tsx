import { AppShell, Badge, Rail, RailItem } from "@tech-prep/ui";
import { useCallback, useEffect, useState } from "react";

import { ConceptsScreen } from "./concepts";
import { engine } from "./course";
import { ExerciseScreen } from "./exercise";
import { SessionScreen } from "./session";
import { LENGTHS, TodayScreen } from "./today";
import { Tutor } from "./tutor";
import type { Course, Session, Today } from "./types";

/** What the main pane shows. */
type View =
  /** What today's session holds. */
  | { kind: "today" }
  /** A session in progress, and when it started. */
  | { kind: "session"; started: number }
  /** Every concept of the course. */
  | { kind: "concepts" };

const TODAY: View = { kind: "today" };

/** Where the session length the learner last picked is kept. */
const LENGTH_KEY = "tp:session-minutes";
const DEFAULT_MINUTES = 15;

const savedMinutes = (): number => {
  const saved = Number(localStorage.getItem(LENGTH_KEY));

  return LENGTHS.includes(saved) ? saved : DEFAULT_MINUTES;
};

export const App = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [today, setToday] = useState<Today | null>(null);
  /** The hour of the day when the app last loaded, for the greeting. */
  const [hour, setHour] = useState(0);
  const [view, setView] = useState<View>(TODAY);
  const [minutes, setMinutes] = useState(savedMinutes);
  const [tutorOpen, setTutorOpen] = useState(false);
  /** What the tutor pane's header says about the session. */
  const [context, setContext] = useState("");

  const refresh = useCallback(() => {
    const load = async () => {
      const [nextCourse, nextSession, nextToday] = await Promise.all([
        engine("course"),
        engine("session"),
        engine("today"),
      ]);

      setCourse(nextCourse);
      setSession(nextSession);
      setToday(nextToday);
      setHour(new Date().getHours());
    };

    void load();
  }, []);

  useEffect(() => {
    refresh();

    return window.tp.onEngineChanged(refresh);
  }, [refresh]);

  const pickMinutes = useCallback((value: number) => {
    localStorage.setItem(LENGTH_KEY, String(value));
    setMinutes(value);
  }, []);

  const openTutor = useCallback(() => setTutorOpen(true), []);
  const toggleTutor = useCallback(() => setTutorOpen((o) => !o), []);

  const toToday = useCallback(() => {
    setContext("");
    setView(TODAY);
    refresh();
  }, [refresh]);

  /** Open another course, on its Today screen. */
  const switchCourse = useCallback(
    (id: string) => {
      const change = async () => {
        await engine("exercise.close");
        await engine("course.select", { course: id });
        toToday();
      };

      void change();
    },
    [toToday]
  );

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

  if (!course || !session || !today) {
    return null;
  }

  const inSession = view.kind === "session";
  let pane = null;

  if (view.kind === "session") {
    pane = (
      <SessionScreen
        course={course.subject.id}
        exercise={session.exercise}
        key={view.started}
        started={view.started}
        minutes={minutes}
        tutorOpen={tutorOpen}
        onChanged={refresh}
        onContext={setContext}
        onEnd={toToday}
        onOpenTutor={openTutor}
        onToggleTutor={toggleTutor}
      />
    );
  } else if (session.exercise) {
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
  } else if (view.kind === "concepts") {
    pane = <ConceptsScreen course={course} onBack={toToday} />;
  } else {
    pane = (
      <TodayScreen
        course={course}
        hour={hour}
        minutes={minutes}
        today={today}
        onConcepts={() => setView({ kind: "concepts" })}
        onMinutes={pickMinutes}
        onStart={() => setView({ kind: "session", started: Date.now() })}
      />
    );
  }

  return (
    <AppShell
      rail={
        <Rail>
          {course.courses.map((c) => {
            const current = c.id === course.subject.id;

            return (
              <RailItem
                active={current}
                count={c.due || undefined}
                key={c.id}
                label={c.name}
                onClick={() => {
                  // A session stays open until the learner ends it.
                  if (inSession) {
                    return;
                  }

                  if (current) {
                    toToday();
                  } else {
                    switchCourse(c.id);
                  }
                }}
              >
                <Badge active={current} initials={c.initials} />
              </RailItem>
            );
          })}
        </Rail>
      }
      tutor={
        <Tutor
          context={context || undefined}
          onClose={() => setTutorOpen(false)}
        />
      }
      tutorOpen={tutorOpen}
    >
      {pane}
    </AppShell>
  );
};
