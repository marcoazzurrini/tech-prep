import {
  Button,
  Chip,
  CodeBlock,
  EmptyState,
  LessonPane,
  LessonText,
  PaneBody,
  PaneFooter,
  ProblemStatement,
  Split,
  SplitSide,
  TaskHeader,
  TaskText,
  TopBar,
  YourTurn,
} from "@tech-prep/ui";
import type { TrailItem } from "@tech-prep/ui";
import { BookOpen, User } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useReducer, useState } from "react";

import { ExerciseAside, ExerciseWorkbench, isCompact } from "./checks";
import { DIFFICULTY, engine, formatDay, inDays } from "./course";
import {
  currentPart,
  reduce,
  reopensLesson,
  shown,
  start,
  trail,
} from "./lesson-flow";
import type { Finished, FlowEvent } from "./lesson-flow";
import type { Lesson, LessonPart, Problem } from "./types";

/** " · Task 2 of 3" for a step with several tasks, else nothing. */
const taskOf = ({ done, total }: { done: number; total: number }): string =>
  total > 1 ? ` · Task ${Math.min(done + 1, total)} of ${total}` : "";

/** What the footer says once the solo problem is finished. */
const soloNote = (lesson: Lesson, { result }: Finished): string => {
  const mine = result.concepts.find((c) => c.id === lesson.id);

  if (result.outcome === "solved") {
    return mine?.next_review
      ? `Solved without help. ${lesson.name} is learned. Its first review is ${inDays(mine.next_review)}.`
      : `Solved without help. ${lesson.name} is learned.`;
  }

  return result.outcome === "solved_with_help"
    ? "Solved with help. This problem comes back tomorrow, so you can solve it alone."
    : "A solution is shown. This problem comes back tomorrow.";
};

/** The learner's saved code for a problem, read-only. */
const SavedCode = ({ slug }: { slug: string }) => {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let current = true;

    const load = async () => {
      const code = await engine("code.read", { slug });

      if (current) {
        setText(code.text);
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, [slug]);

  return text === null ? null : (
    <CodeBlock code={text.trimEnd()} grow lineNumbers />
  );
};

interface StepProps {
  lesson: Lesson;
  /** How the step's problem ended, once it has. */
  finished: Finished | null;
  onFinished: (finished: Finished) => void;
  onOpenTutor: () => void;
  /** What the footer says about the task before this one, such as "Part 1 was right." */
  note?: string;
}

interface GuidedProps extends StepProps {
  /** The lesson text, with the task under it. */
  text: ReactNode;
  /** Move on to the solo problem. */
  onContinue: () => void;
}

/** Step 1: the lesson on the left, its small guided problem on the right. */
const GuidedStep = ({
  lesson,
  text,
  finished,
  note,
  onFinished,
  onOpenTutor,
  onContinue,
}: GuidedProps) => {
  const working = lesson.attempt?.slug === lesson.guided.slug;

  // A right answer moves on by itself, so only a task that was given up stays finished.
  const again = finished && {
    actions: (
      <Button variant="primary" onClick={onContinue}>
        Try again
      </Button>
    ),
    note: "A solution is shown. Do the task again to move on.",
  };

  return (
    <Split>
      <SplitSide key={lesson.guided.slug}>{text}</SplitSide>
      <SplitSide stack>
        {working || finished ? (
          <ExerciseWorkbench
            done={again ?? undefined}
            // A new attempt on the same exercise starts with a new answer area.
            key={`${lesson.guided.slug}:${lesson.attempt?.id ?? ""}`}
            note={note}
            problem={lesson.guided}
            strip={isCompact(lesson.guided) ? { label: "Try it" } : undefined}
            onAskTutor={onOpenTutor}
            onFinished={onFinished}
          />
        ) : (
          <EmptyState title="This lesson is locked">
            Finish the lessons before it first.
          </EmptyState>
        )}
      </SplitSide>
    </Split>
  );
};

interface PastTaskProps {
  /** A guided task the learner already solved. */
  slug: string;
  /** Names where the button leads, such as "Back to part 2". */
  back: string;
  onBack: () => void;
  onOpenTutor: () => void;
}

/** The task of an earlier part, with the learner's answer. It can be read, not changed. */
const PastTask = ({ slug, back, onBack, onOpenTutor }: PastTaskProps) => {
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    let current = true;

    const load = async () => {
      const loaded = await engine("problem", { slug });

      if (current) {
        setProblem(loaded);
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, [slug]);

  if (!problem || problem.slug !== slug) {
    return null;
  }

  return (
    <ExerciseWorkbench
      done={{
        actions: (
          <Button variant="primary" onClick={onBack}>
            {back}
          </Button>
        ),
        note: "You solved this part.",
      }}
      key={slug}
      problem={problem}
      strip={isCompact(problem) ? { label: "Try it" } : undefined}
      onAskTutor={onOpenTutor}
      onFinished={() => {
        // The task is finished already: nothing can be handed in.
      }}
    />
  );
};

interface SoloProps extends StepProps {
  /** The lesson after this one, for the "Next lesson" button. */
  next: string | null;
  onSelect: (lesson: string) => void;
  /** Start the solo problem again on a lesson that is already learned, or its next solo task. */
  onPractise: () => void;
  /** Show the task above the editor, when its statement is not beside it. */
  strip?: { label: string };
}

/** What sits under the statement in step 2: the editor, the saved code, or a note to come back. */
const SoloWork = ({
  lesson,
  finished,
  note,
  onFinished,
  onOpenTutor,
  next,
  onSelect,
  onPractise,
  strip,
}: SoloProps) => {
  const learned = lesson.status === "done";

  const nextButton = next && (
    <Button variant="primary" onClick={() => onSelect(next)}>
      Next lesson
    </Button>
  );

  if (lesson.attempt?.slug === lesson.solo.slug || finished) {
    // A task solved alone moves on to the next one by itself. What stays finished is the
    // last task, or one that needed help.
    const footer = finished && {
      actions: nextButton,
      note: soloNote(lesson, finished),
    };

    // A compact task says beside its statement that the lesson is closed.
    const closed =
      learned || isCompact(lesson.solo)
        ? ""
        : "The lesson is closed. Opening it counts as help.";

    return (
      <ExerciseWorkbench
        done={footer ?? undefined}
        key={`${lesson.solo.slug}:${lesson.attempt?.id ?? ""}`}
        note={[note, closed].filter(Boolean).join(" ") || undefined}
        problem={lesson.solo}
        strip={strip}
        onAskTutor={onOpenTutor}
        onFinished={onFinished}
      />
    );
  }

  if (learned) {
    return (
      <>
        <SavedCode slug={lesson.solo.slug} />
        <PaneFooter
          start={
            <span className="tp-pane-footer__note">
              You learned this lesson. Reviews keep it fresh.
            </span>
          }
        >
          <Button onClick={onPractise}>Practise again</Button>
          {nextButton}
        </PaneFooter>
      </>
    );
  }

  if (lesson.wait_until) {
    return (
      <PaneFooter
        start={
          <span className="tp-pane-footer__note">
            You needed help last time. This problem opens again on{" "}
            {formatDay(lesson.wait_until)}. You can read the lesson meanwhile.
          </span>
        }
      >
        {nextButton}
      </PaneFooter>
    );
  }

  return null;
};

/** The solo problem's title, chips and statement. */
const SoloStatement = ({
  lesson,
  finished,
}: Pick<StepProps, "lesson" | "finished">) => {
  const learned =
    lesson.status === "done" || finished?.result.outcome === "solved";

  return (
    <PaneBody share>
      <TaskHeader
        chips={
          <>
            <Chip muted>{DIFFICULTY[lesson.solo.difficulty]}</Chip>
            {learned && <Chip>Solved</Chip>}
            {learned && <Chip tone="green">{lesson.name} · Learned</Chip>}
          </>
        }
        title={lesson.solo.title}
      />
      <ProblemStatement text={lesson.solo.statement ?? ""} />
    </PaneBody>
  );
};

/** A compact solo task to read beside its editor: its statement and what its kind shows. */
const SoloTaskText = ({ lesson, task }: { lesson: Lesson; task: string }) => (
  <TaskText
    chips={
      <>
        <Chip icon={User}>On your own</Chip>
        <Chip muted>{task}</Chip>
        {lesson.status === "done" && (
          <Chip tone="green">{lesson.name} · Learned</Chip>
        )}
      </>
    }
    title={lesson.solo.title}
  >
    <ProblemStatement text={lesson.solo.statement ?? ""} />
    <ExerciseAside problem={lesson.solo} />
    {lesson.status !== "done" && (
      <p className="tp-task-text__note">
        The lesson is closed. Opening it counts as help.
      </p>
    )}
  </TaskText>
);

/** The lesson's text, or one part of it, with the task of a code lesson under it. */
const LessonBody = ({
  lesson,
  part,
  task,
}: {
  lesson: Lesson;
  part?: LessonPart;
  /** Show the guided task under the text. A compact task sits above its editor. */
  task: boolean;
}) => (
  <LessonText
    label={<Chip icon={BookOpen}>Lesson</Chip>}
    text={part?.text ?? ""}
    title={part?.title ?? lesson.name}
  >
    {task && (
      <YourTurn label="Your turn · with the lesson" title={lesson.guided.title}>
        <ProblemStatement text={lesson.guided.statement ?? ""} />
      </YourTurn>
    )}
  </LessonText>
);

interface StepsBarProps {
  lesson: Lesson;
  step: 1 | 2;
  peeking: boolean;
  onPeek: () => void;
  tutorOpen: boolean;
  onToggleTutor: () => void;
}

/** The top bar of a lesson read in one go: its name and its two steps. */
const StepsBar = ({
  lesson,
  step,
  peeking,
  onPeek,
  tutorOpen,
  onToggleTutor,
}: StepsBarProps) => (
  <TopBar
    actions={
      step === 2 &&
      lesson.parts.length > 0 && (
        <Button aria-pressed={peeking} icon={BookOpen} onClick={onPeek}>
          Lesson
        </Button>
      )
    }
    chapter={lesson.topic}
    lesson={lesson.name}
    position={`${
      step === 1 ? "Step 1 of 2 · With the lesson" : "Step 2 of 2 · On your own"
    }${taskOf(step === 1 ? lesson.guided_tasks : lesson.solo_tasks)}`}
    steps={{ at: step - 1, count: 2 }}
    tutorOpen={tutorOpen}
    onToggleTutor={onToggleTutor}
  />
);

interface LessonScreenProps {
  /** The concept whose lesson to show. */
  id: string;
  /** The lesson after this one in the course, if any. */
  next: string | null;
  tutorOpen: boolean;
  onToggleTutor: () => void;
  onOpenTutor: () => void;
  /** Called when the learner's progress changed, so the lessons column reloads. */
  onChanged: () => void;
  onSelect: (lesson: string) => void;
}

/**
 * One lesson. Step 1 shows the lesson text beside a small guided problem. Step 2 closes the
 * lesson and shows the solo problem alone; the learner can reopen the lesson, which counts
 * as help.
 */
export const LessonScreen = ({
  id,
  next,
  tutorOpen,
  onToggleTutor,
  onOpenTutor,
  onChanged,
  onSelect,
}: LessonScreenProps) => {
  const [flow, send] = useReducer(reduce, start);
  const { finished, lesson, note, peeking, request } = flow;

  // The engine starts the lesson's next task when there is one to start. A finished lesson
  // is only shown, unless the learner asks to practise it again.
  useEffect(() => {
    const load = async () => {
      send({
        lesson: await engine("lesson.open", {
          concept: id,
          practise: request.practise,
        }),
        type: "loaded",
      });
      onChanged();
    };

    void load();
  }, [id, request, onChanged]);

  if (!lesson) {
    return <LessonPane>{null}</LessonPane>;
  }

  /** Apply what the learner did. Reopening the lesson in the solo step is told to the engine. */
  const act = (event: FlowEvent) => {
    if (reopensLesson(flow, event)) {
      void engine("lesson.peek", { concept: id });
    }

    send(event);
  };

  const finish = (result: Finished) => {
    send({ finished: result, type: "finished" });
    onChanged();
  };

  const again = () => send({ type: "again" });
  const { parts, step } = lesson;
  const { paged, part, past, reading } = shown(flow, lesson);

  const bar = paged ? (
    <TopBar
      trail={trail(flow, lesson).map(({ event, ...stop }): TrailItem => ({
        ...stop,
        onSelect: event ? () => act(event) : undefined,
      }))}
      tutorOpen={tutorOpen}
      onToggleTutor={onToggleTutor}
    />
  ) : (
    <StepsBar
      lesson={lesson}
      peeking={peeking}
      step={step}
      tutorOpen={tutorOpen}
      onPeek={() => act({ type: "toggle_peek" })}
      onToggleTutor={onToggleTutor}
    />
  );

  if (!parts.length) {
    return (
      <LessonPane>
        {bar}
        <PaneBody>
          <EmptyState title="This lesson is not written yet">
            Pick another lesson from the list.
          </EmptyState>
        </PaneBody>
      </LessonPane>
    );
  }

  // The part on screen is the one the learner went back to, else the one they are on.
  const text = (
    <LessonBody
      lesson={lesson}
      part={parts[part]}
      task={step === 1 && !isCompact(lesson.guided)}
    />
  );

  // An earlier part: its text, and its task with the answer the learner gave.
  if (past) {
    return (
      <LessonPane>
        {bar}
        <Split>
          <SplitSide key={past}>{text}</SplitSide>
          <SplitSide stack>
            <PastTask
              back={`Back to part ${currentPart(lesson) + 1}`}
              slug={past}
              onBack={() => act({ type: "back_to_task" })}
              onOpenTutor={onOpenTutor}
            />
          </SplitSide>
        </Split>
      </LessonPane>
    );
  }

  if (step === 1) {
    return (
      <LessonPane>
        {bar}
        <GuidedStep
          finished={finished}
          lesson={lesson}
          note={note}
          text={text}
          onContinue={again}
          onFinished={finish}
          onOpenTutor={onOpenTutor}
        />
      </LessonPane>
    );
  }

  const soloTask = `Task ${Math.min(lesson.solo_tasks.done + 1, lesson.solo_tasks.total)} of ${lesson.solo_tasks.total}`;

  // A compact task is short: its statement sits on the left, its editor on the right. With
  // the lesson reopened, the lesson takes the left and the task moves above the editor.
  if (isCompact(lesson.solo)) {
    return (
      <LessonPane>
        {bar}
        <Split>
          <SplitSide key={reading ? part : "task"}>
            {reading ? text : <SoloTaskText lesson={lesson} task={soloTask} />}
          </SplitSide>
          <SplitSide stack>
            <SoloWork
              finished={finished}
              lesson={lesson}
              next={next}
              note={note}
              strip={
                reading ? { label: `${soloTask} · on your own` } : undefined
              }
              onFinished={finish}
              onOpenTutor={onOpenTutor}
              onPractise={again}
              onSelect={onSelect}
            />
          </SplitSide>
        </Split>
      </LessonPane>
    );
  }

  const solo = (
    <>
      <SoloStatement finished={finished} lesson={lesson} />
      <SoloWork
        finished={finished}
        lesson={lesson}
        next={next}
        note={note}
        onFinished={finish}
        onOpenTutor={onOpenTutor}
        onPractise={again}
        onSelect={onSelect}
      />
    </>
  );

  return (
    <LessonPane>
      {bar}
      {peeking ? (
        <Split>
          <SplitSide>{text}</SplitSide>
          <SplitSide stack>{solo}</SplitSide>
        </Split>
      ) : (
        solo
      )}
    </LessonPane>
  );
};
