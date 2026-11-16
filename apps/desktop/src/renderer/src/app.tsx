import { AppShell, Badge, Rail, RailDivider, RailItem } from "@tech-prep/ui";
import { CalendarCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { dueCount } from "./course";
import { ExerciseLesson, LessonView } from "./lesson";
import { Lessons } from "./lessons";
import { Tutor } from "./tutor";
import type { Problem, Roadmap, Session } from "./types";

/** The only subject so far. */
const SUBJECT = { initials: "75", name: "Blind 75" };

export const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  /** A problem the learner picked; null follows the tutor's current problem. */
  const pickedSlug = useRef<string | null>(null);
  const [picked, setPicked] = useState<Problem | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [tutorOpen, setTutorOpen] = useState(true);

  const load = useCallback(async (slug: string) => {
    // SAFETY: the bridge's `problem` method returns the engine's Problem shape.
    const problem = (await window.tp.engine("problem", { slug })) as Problem;

    // Skip a reply that arrives after the learner picked something else.
    if (pickedSlug.current === slug) {
      setPicked(problem);
    }
  }, []);

  const followTutor = useCallback(() => {
    pickedSlug.current = null;
    setPicked(null);
  }, []);

  const refresh = useCallback(() => {
    const loadSession = async () => {
      // SAFETY: the bridge's `session` method returns the engine's Session shape.
      const next = (await window.tp.engine("session")) as Session;
      setSession(next);
      const topic = next.problem?.topic;

      if (topic) {
        setOpen((all) => (all.has(topic) ? all : new Set([...all, topic])));
      }
    };

    const loadRoadmap = async () => {
      // SAFETY: the bridge's `roadmap` method returns the engine's Roadmap shape.
      setRoadmap((await window.tp.engine("roadmap")) as Roadmap);
    };

    void loadSession();
    void loadRoadmap();

    if (pickedSlug.current) {
      void load(pickedSlug.current);
    }
  }, [load]);

  useEffect(() => {
    refresh();

    return window.tp.onEngineChanged(refresh);
  }, [refresh]);

  const select = useCallback(
    (slug: string) => {
      if (slug === session?.problem?.slug) {
        followTutor();
      } else {
        pickedSlug.current = slug;
        void load(slug);
      }
    },
    [followTutor, load, session]
  );

  const toggleTopic = useCallback((topic: string) => {
    setOpen((all) => {
      const next = new Set(all);

      if (!next.delete(topic)) {
        next.add(topic);
      }

      return next;
    });
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

  if (!session || !roadmap) {
    return null;
  }

  const shown = picked ?? session.problem;
  // The tutor's exercise takes the main pane unless the learner picked a problem to read.
  const exercise = picked ? null : session.exercise;
  const due = dueCount(roadmap);

  return (
    <AppShell
      nav={
        <Lessons
          current={session.problem?.slug ?? null}
          open={open}
          roadmap={roadmap}
          selected={shown?.slug ?? null}
          subject={SUBJECT.name}
          onSelect={select}
          onToggle={toggleTopic}
        />
      }
      rail={
        <Rail>
          <RailItem
            active={!picked}
            count={due || undefined}
            label="Today"
            onClick={followTutor}
          >
            <CalendarCheck size={16} />
          </RailItem>
          <RailDivider />
          <RailItem active label={SUBJECT.name}>
            <Badge active initials={SUBJECT.initials} />
          </RailItem>
        </Rail>
      }
      tutor={
        <Tutor
          context={session.exercise?.title ?? session.problem?.title}
          onClose={() => setTutorOpen(false)}
        />
      }
      tutorOpen={tutorOpen}
    >
      {exercise ? (
        <ExerciseLesson
          chapter={
            roadmap.topics.find((t) => t.id === session.problem?.topic)?.name
          }
          exercise={exercise}
          tutorOpen={tutorOpen}
          onChanged={refresh}
          onOpenTutor={() => setTutorOpen(true)}
          onToggleTutor={() => setTutorOpen((o) => !o)}
        />
      ) : (
        <LessonView
          problem={shown}
          roadmap={roadmap}
          session={session}
          tutorOpen={tutorOpen}
          onOpenTutor={() => setTutorOpen(true)}
          onSelect={select}
          onToggleTutor={() => setTutorOpen((o) => !o)}
        />
      )}
    </AppShell>
  );
};
