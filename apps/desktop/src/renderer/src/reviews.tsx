import {
  Badge,
  Button,
  Chip,
  Count,
  LessonPane,
  List,
  ListRow,
  Page,
  PageActions,
  PageLabel,
  PageNote,
  ProblemStatement,
  ResultCard,
  Split,
  SplitSide,
  TaskText,
  TopBar,
} from "@tech-prep/ui";
import { ArrowRight, BookOpen, CircleCheck, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { DIFFICULTY, engine, formatDay, inDays } from "./course";
import { TaskAside, TaskWorkbench } from "./task-kinds";
import type { Problem, Result, Reviews } from "./types";
import type { Finished } from "./workbench";

const plural = (n: number, word: string): string =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

type Track = Reviews["tracks"][number];

/** The line under a track's name: what is due, or when the next review comes. */
const trackDetail = (t: Track): string => {
  if (t.problems) {
    return `${plural(t.problems, "problem")} · about ${t.minutes} min`;
  }

  return t.next_due
    ? `Next review on ${formatDay(t.next_due)}`
    : "No reviews yet";
};

interface ReviewsScreenProps {
  tutorOpen: boolean;
  onToggleTutor: () => void;
  /** Start the reviews of one track, or of every track when none is named. */
  onStart: (track?: string) => void;
}

/** What is due, per track. The calendar icon opens this screen. */
export const ReviewsScreen = ({
  tutorOpen,
  onToggleTutor,
  onStart,
}: ReviewsScreenProps) => {
  const [reviews, setReviews] = useState<Reviews | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const load = async () => {
      setReviews(await engine("reviews"));
      setToday(formatDay(new Date().toISOString()));
    };

    void load();
  }, []);

  if (!reviews) {
    return <LessonPane>{null}</LessonPane>;
  }

  const due = reviews.tracks.filter((t) => t.problems > 0);
  const several = due.length > 1;

  const [soonest] = reviews.tracks
    .flatMap((t) => (t.next_due ? [t.next_due] : []))
    .toSorted();

  let lead = "Nothing is due. Reviews start after you learn a lesson.";

  if (due.length) {
    lead = `${plural(reviews.problems, "review")} due today, in ${plural(due.length, "track")}.`;
  } else if (soonest) {
    lead = `Nothing is due today. Your next review is on ${formatDay(soonest)}.`;
  }

  return (
    <LessonPane>
      <TopBar
        lesson="Reviews"
        tutorOpen={tutorOpen}
        onToggleTutor={onToggleTutor}
      />
      <Page eyebrow={today} lead={lead} title="Reviews">
        {several && (
          <>
            <PageActions
              note={`${plural(reviews.problems, "problem")}, mixed across tracks · about ${reviews.minutes} min`}
            >
              <Button
                iconEnd={ArrowRight}
                size="large"
                variant="primary"
                onClick={() => onStart()}
              >
                Review all
              </Button>
            </PageActions>
            <PageLabel>Or one track</PageLabel>
          </>
        )}
        <List>
          {reviews.tracks.map((t) => (
            <ListRow
              detail={trackDetail(t)}
              end={
                t.problems ? (
                  <>
                    <Count>{t.problems} due</Count>
                    <Button
                      iconEnd={ArrowRight}
                      variant={several ? "secondary" : "primary"}
                      onClick={() => onStart(t.id)}
                    >
                      Start
                    </Button>
                  </>
                ) : (
                  "Nothing due"
                )
              }
              key={t.id}
              start={<Badge active initials={t.initials} />}
              title={t.name}
            />
          ))}
        </List>
        <PageNote>
          A review is a problem you solve without the lesson. It does not say
          which lesson it comes from.
        </PageNote>
      </Page>
    </LessonPane>
  );
};

/** Open the next review in the engine, of one track or of all. Null when nothing is left. */
const nextReview = async (course?: string): Promise<Problem | null> => {
  const reply = await engine("review.next", {
    course,
  });

  return reply.problem;
};

/** One finished review, for the closing summary. */
interface Done {
  title: string;
  result: Result;
}

interface ReviewSessionProps {
  /** The track's name, shown in the top bar so the learner knows which course they are in. */
  track: string;
  /** The one track being reviewed. Every track is reviewed when it is left out. */
  only?: string;
  /** How many reviews were due when the session started. */
  planned: number;
  tutorOpen: boolean;
  onToggleTutor: () => void;
  onOpenTutor: () => void;
  onChanged: () => void;
  /** Leave the session: back to the reviews screen. */
  onEnd: () => void;
  onOpenLesson: (lesson: string) => void;
  /** The next lesson of the course, offered once the reviews are done. */
  nextLesson: string | null;
}

/** The verdict under the statement, with the concepts the problem reviewed. */
const Verdict = ({
  finished,
  onOpenLesson,
}: {
  finished: Finished;
  onOpenLesson: (lesson: string) => void;
}) => {
  const { result } = finished;
  // The concepts that were missed: their approach is shown, with a way back to the lesson.
  const ideas = result.concepts.filter((c) => c.result === "fail");

  const chips = (
    <div className="tp-result__chips">
      {result.concepts.map((c) => (
        <Chip key={c.id} tone={c.result === "pass" ? "green" : "amber"}>
          {c.name} ·{" "}
          {c.next_review
            ? `next review ${inDays(c.next_review)}`
            : "comes back soon"}
        </Chip>
      ))}
    </div>
  );

  if (result.outcome === "solved") {
    return (
      <ResultCard title="Solved without help" tone="green">
        <p>This problem reviewed what you learned in:</p>
        {chips}
      </ResultCard>
    );
  }

  return (
    <ResultCard
      title={
        result.outcome === "gave_up"
          ? "A solution is shown"
          : "Solved with help"
      }
      tone="amber"
    >
      <p>You needed help to choose the approach, so this comes back soon.</p>
      {chips}
      {ideas.map((l) => (
        <div key={l.id}>
          <h4>The approach</h4>
          <p>{l.key_idea}</p>
          <Button
            icon={BookOpen}
            variant="ghost"
            onClick={() => onOpenLesson(l.id)}
          >
            Open the lesson: {l.name}
          </Button>
        </div>
      ))}
    </ResultCard>
  );
};

/**
 * Reviews, one full problem at a time. The screen has no lessons column, no chapter and no
 * lesson, so nothing names the approach: choosing it is what a review tests.
 */
export const ReviewSession = ({
  track,
  only,
  planned,
  tutorOpen,
  onToggleTutor,
  onOpenTutor,
  onChanged,
  onEnd,
  onOpenLesson,
  nextLesson,
}: ReviewSessionProps) => {
  /** The review on screen: null once nothing is left to review. */
  const [problem, setProblem] = useState<Problem | null | "loading">("loading");
  const [finished, setFinished] = useState<Finished | null>(null);
  const [done, setDone] = useState<Done[]>([]);

  // Open the first review, or resume the one that was open.
  useEffect(() => {
    const load = async () => {
      setProblem(await nextReview(only));
      onChanged();
    };

    void load();
  }, [onChanged, only]);

  if (problem === "loading") {
    return <LessonPane>{null}</LessonPane>;
  }

  const total = Math.max(planned, done.length + (problem ? 1 : 0));

  if (!problem) {
    const helped = done.filter((d) => d.result.outcome !== "solved").length;

    return (
      <LessonPane>
        <TopBar
          lesson="Reviews"
          tutorOpen={tutorOpen}
          onToggleTutor={onToggleTutor}
        />
        <Page
          lead={
            done.length
              ? `${track}: ${plural(done.length, "problem")} done${helped ? `, ${helped} with help` : ""}.`
              : "Nothing is due right now."
          }
          title={done.length ? "Reviews done" : "No reviews"}
        >
          {done.length > 0 && (
            <List>
              {done.map((d) => (
                <ListRow
                  detail={
                    d.result.outcome === "solved"
                      ? "Solved without help"
                      : "Needed help. It comes back soon"
                  }
                  end={plural(d.result.concepts.length, "concept")}
                  key={d.title}
                  start={
                    <CircleCheck
                      className={
                        d.result.outcome === "solved"
                          ? "tp-tone--green"
                          : "tp-tone--amber"
                      }
                      size={18}
                      aria-hidden
                    />
                  }
                  title={d.title}
                />
              ))}
            </List>
          )}
          <PageActions>
            {nextLesson && (
              <Button
                iconEnd={ArrowRight}
                size="large"
                variant="primary"
                onClick={() => onOpenLesson(nextLesson)}
              >
                Continue with the next lesson
              </Button>
            )}
            <Button onClick={onEnd}>Back to reviews</Button>
          </PageActions>
        </Page>
      </LessonPane>
    );
  }

  const number = done.length + 1;

  const end = async () => {
    if (!finished) {
      await engine("attempt.pause", { slug: problem.slug });
    }

    onChanged();
    onEnd();
  };

  /** Open the next review, after noting how this one ended. */
  const advance = async (last: Finished | null) => {
    if (last) {
      setDone((all) => [...all, { result: last.result, title: problem.title }]);
    }

    const upcoming = await nextReview(only);
    setFinished(null);
    setProblem(upcoming);
    onChanged();
  };

  /**
   * A review solved without help opens the next one by itself; the closing summary lists it.
   * One that needed help stays on screen, so the learner can read what it reviewed.
   */
  const finish = (result: Finished) => {
    if (result.result.moves_on) {
      void advance(result);
    } else {
      setFinished(result);
      onChanged();
    }
  };

  return (
    <LessonPane>
      <TopBar
        actions={
          <Button
            variant="ghost"
            onClick={() => {
              void end();
            }}
          >
            End reviews
          </Button>
        }
        lesson={`${track} · Review`}
        position={`${number} of ${total}`}
        steps={total <= 8 ? { at: number - 1, count: total } : undefined}
        tutorOpen={tutorOpen}
        onToggleTutor={onToggleTutor}
      />
      <Split>
        <SplitSide>
          <TaskText
            chips={
              <>
                <Chip icon={RotateCcw} muted>
                  Review {number} of {total}
                </Chip>
                <Chip muted>{DIFFICULTY[problem.difficulty]}</Chip>
              </>
            }
            title={problem.title}
          >
            <ProblemStatement text={problem.statement ?? ""} />
            <TaskAside problem={problem} />
            {finished && (
              <Verdict finished={finished} onOpenLesson={onOpenLesson} />
            )}
          </TaskText>
        </SplitSide>
        <SplitSide stack>
          <TaskWorkbench
            done={
              finished
                ? {
                    actions: (
                      <>
                        <Button onClick={onOpenTutor}>Ask the tutor</Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            void advance(finished);
                          }}
                        >
                          Next review
                        </Button>
                      </>
                    ),
                    note: "",
                  }
                : undefined
            }
            key={problem.slug}
            problem={problem}
            onAskTutor={onOpenTutor}
            onFinished={finish}
          />
        </SplitSide>
      </Split>
    </LessonPane>
  );
};
