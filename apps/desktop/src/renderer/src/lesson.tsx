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
import { BookOpen, User } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { DIFFICULTY, engine, formatDay, inDays } from "./course";
import { JqInput, JqWorkbench } from "./jq-workbench";
import type { Code, Lesson } from "./types";
import { Workbench } from "./workbench";
import type { Finished } from "./workbench";

/**
 * The lesson text to show. A lesson written in parts grows with the guided tasks: the part
 * of the task on screen is the last one shown. Its summary appears once the last guided task
 * is solved. Outside step 1 the whole lesson is shown.
 */
const shownParts = (
  lesson: Lesson,
  step: 1 | 2,
  finished: Finished | null
): string | string[] => {
  const parts = lesson.parts ?? [];

  if (parts.length < 2 || step === 2) {
    return lesson.text ?? "";
  }

  const { done, total } = lesson.guided_tasks;
  const solved = finished && finished.result.outcome !== "gave_up";
  const summary = solved && done + 1 >= total ? 1 : 0;

  return parts.slice(0, Math.min(done, total - 1) + 1 + summary);
};

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
      const code = await engine<Code>("code.read", { slug });

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
  onFinished,
  onOpenTutor,
  onContinue,
}: GuidedProps) => {
  const working = lesson.attempt?.slug === lesson.guided.slug;
  const gaveUp = finished?.result.outcome === "gave_up";
  const lead = gaveUp ? "A solution is shown" : "Solved";
  const { jq } = lesson.guided;
  const { done, total } = lesson.guided_tasks;

  if (jq && (working || finished)) {
    // The lesson was loaded before this task was finished, so `done` does not count it yet.
    const last = done + 1 >= total;

    let next = {
      label: "Next task",
      note: `Right. It also passed ${jq.hidden} hidden inputs.`,
    };

    if (gaveUp) {
      next = {
        label: "Try again",
        note: "A solution is shown. Do the task again to move on.",
      };
    } else if (last) {
      next = {
        label: "Continue on your own",
        note: "Right. Next: tasks without the lesson beside you.",
      };
    }

    return (
      <Split>
        <SplitSide>{text}</SplitSide>
        <SplitSide stack>
          <JqWorkbench
            done={
              finished
                ? {
                    actions: (
                      <Button variant="primary" onClick={onContinue}>
                        {next.label}
                      </Button>
                    ),
                    note: next.note,
                  }
                : undefined
            }
            jq={jq}
            key={lesson.guided.slug}
            problem={lesson.guided}
            strip={{
              label: `Task ${Math.min(done + 1, total)} of ${total} · with the lesson`,
              tasks: { done: finished && !gaveUp ? done + 1 : done, total },
            }}
            onAskTutor={onOpenTutor}
            onFinished={onFinished}
          />
        </SplitSide>
      </Split>
    );
  }

  return (
    <Split>
      <SplitSide>{text}</SplitSide>
      <SplitSide stack>
        {working || finished ? (
          <Workbench
            done={
              finished
                ? {
                    actions: (
                      <Button variant="primary" onClick={onContinue}>
                        Continue to the problem
                      </Button>
                    ),
                    note: `${lead}. Next: ${lesson.solo.title}, without the lesson beside you.`,
                  }
                : undefined
            }
            key={lesson.guided.slug}
            problem={lesson.guided}
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

interface SoloProps extends StepProps {
  /** The lesson after this one, for the "Next lesson" button. */
  next: string | null;
  onSelect: (lesson: string) => void;
  /** Start the solo problem again on a lesson that is already learned, or its next solo task. */
  onPractise: () => void;
  /** For a jq task: show the task above the filter, when the statement is not beside it. */
  strip?: { label: string; tasks?: { done: number; total: number } };
}

/** What sits under the statement in step 2: the editor, the saved code, or a note to come back. */
const SoloWork = ({
  lesson,
  finished,
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

  const { jq } = lesson.solo;

  if (jq && (lesson.attempt?.slug === lesson.solo.slug || finished)) {
    // One more solo task is left when this one was solved alone and was not the last.
    const more =
      finished?.result.outcome === "solved" &&
      lesson.solo_tasks.done + 1 < lesson.solo_tasks.total;

    let footer = finished && {
      actions: nextButton,
      note: soloNote(lesson, finished),
    };

    if (more) {
      footer = {
        actions: (
          <Button variant="primary" onClick={onPractise}>
            Next task
          </Button>
        ),
        note: "Solved without help. One more task on your own.",
      };
    }

    return (
      <JqWorkbench
        done={footer ?? undefined}
        jq={jq}
        key={lesson.solo.slug}
        problem={lesson.solo}
        strip={strip}
        onAskTutor={onOpenTutor}
        onFinished={onFinished}
      />
    );
  }

  if (lesson.attempt?.slug === lesson.solo.slug || finished) {
    return (
      <Workbench
        done={
          finished
            ? { actions: nextButton, note: soloNote(lesson, finished) }
            : undefined
        }
        key={lesson.solo.slug}
        note={
          learned
            ? undefined
            : "The lesson is closed. Opening it counts as help."
        }
        problem={lesson.solo}
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
  const [lesson, setLesson] = useState<Lesson | null>(null);
  /** The step on screen. It stays on step 1 after the guided problem is solved, until Continue. */
  const [step, setStep] = useState<1 | 2>(1);
  const [finished, setFinished] = useState<Finished | null>(null);
  const [peeking, setPeeking] = useState(false);

  /**
   * What to load: `start` also opens the lesson's current step even when the lesson is
   * already learned. Changing it loads the lesson again.
   */
  const [request, setRequest] = useState({ start: false });

  useEffect(() => {
    const load = async () => {
      const seen = await engine<Lesson>("lesson", { concept: id });

      // A finished lesson is only shown, unless the learner asks to practise it again.
      const work =
        seen.text !== null &&
        seen.status !== "locked" &&
        (request.start || seen.status !== "done");

      const loaded = work
        ? await engine<Lesson>("lesson.open", { concept: id })
        : seen;

      setLesson(loaded);
      setStep(loaded.step);
      setFinished(null);
      setPeeking(false);
      onChanged();
    };

    void load();
  }, [id, request, onChanged]);

  if (!lesson) {
    return <LessonPane>{null}</LessonPane>;
  }

  const finish = (result: Finished) => {
    setFinished(result);
    onChanged();
  };

  const togglePeek = () => {
    if (!peeking) {
      void engine("lesson.peek", { concept: id });
    }

    setPeeking((p) => !p);
  };

  const bar = (
    <TopBar
      actions={
        step === 2 &&
        lesson.text && (
          <Button aria-pressed={peeking} icon={BookOpen} onClick={togglePeek}>
            Lesson
          </Button>
        )
      }
      chapter={lesson.topic}
      lesson={lesson.name}
      position={`${
        step === 1
          ? "Step 1 of 2 · With the lesson"
          : "Step 2 of 2 · On your own"
      }${taskOf(step === 1 ? lesson.guided_tasks : lesson.solo_tasks)}`}
      steps={{ at: step - 1, count: 2 }}
      tutorOpen={tutorOpen}
      onToggleTutor={onToggleTutor}
    />
  );

  if (!lesson.text) {
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

  const text = (
    <LessonText
      label={<Chip icon={BookOpen}>Lesson</Chip>}
      text={shownParts(lesson, step, finished)}
      title={lesson.name}
    >
      {step === 1 && !lesson.guided.jq && (
        <YourTurn
          label="Your turn · with the lesson"
          title={lesson.guided.title}
        >
          <ProblemStatement text={lesson.guided.statement ?? ""} />
        </YourTurn>
      )}
    </LessonText>
  );

  if (step === 1) {
    return (
      <LessonPane>
        {bar}
        <GuidedStep
          finished={finished}
          lesson={lesson}
          text={text}
          onContinue={() => setRequest({ start: true })}
          onFinished={finish}
          onOpenTutor={onOpenTutor}
        />
      </LessonPane>
    );
  }

  const soloTask = `Task ${Math.min(lesson.solo_tasks.done + 1, lesson.solo_tasks.total)} of ${lesson.solo_tasks.total}`;

  // A jq task is short: its statement and input sit on the left, the filter on the right.
  // With the lesson reopened, the lesson takes the left and the task moves above the filter.
  if (lesson.solo.jq) {
    return (
      <LessonPane>
        {bar}
        <Split>
          <SplitSide>
            {peeking ? (
              text
            ) : (
              <TaskText
                chips={
                  <>
                    <Chip icon={User}>On your own</Chip>
                    <Chip muted>{soloTask}</Chip>
                    {lesson.status === "done" && (
                      <Chip tone="green">{lesson.name} · Learned</Chip>
                    )}
                  </>
                }
                title={lesson.solo.title}
              >
                <ProblemStatement text={lesson.solo.statement ?? ""} />
                <JqInput jq={lesson.solo.jq} />
                {lesson.status !== "done" && (
                  <p className="tp-task-text__note">
                    The lesson is closed. Opening it counts as help.
                  </p>
                )}
              </TaskText>
            )}
          </SplitSide>
          <SplitSide stack>
            <SoloWork
              finished={finished}
              lesson={lesson}
              next={next}
              strip={
                peeking ? { label: `${soloTask} · on your own` } : undefined
              }
              onFinished={finish}
              onOpenTutor={onOpenTutor}
              onPractise={() => setRequest({ start: true })}
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
        onFinished={finish}
        onOpenTutor={onOpenTutor}
        onPractise={() => setRequest({ start: true })}
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
