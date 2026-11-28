import {
  Button,
  Card,
  CardColumns,
  CardStack,
  Figure,
  Figures,
  Hero,
  LengthPicker,
  PlanRow,
  Progress,
  SessionBar,
  SessionBody,
  SessionPane,
} from "@tech-prep/ui";
import { Check, RotateCcw, Sparkles, User } from "lucide-react";

import { inDays, useEnter } from "./course";
import type { Course, Today } from "./types";

/** The session lengths the learner picks from, in minutes. */
export const LENGTHS = [5, 15, 25, 40];

const plural = (n: number, word: string): string =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

const greeting = (hour: number): string => {
  if (hour < 12) {
    return "Good morning.";
  }

  return hour < 18 ? "Good afternoon." : "Good evening.";
};

/** The line under the title: what the session holds, in order. */
const summary = ({ reviews, concept, next_due: nextDue }: Today): string => {
  if (reviews.concepts && concept) {
    return `${plural(reviews.concepts, "concept")} to review, then this new one.`;
  }

  if (reviews.concepts) {
    return `${plural(reviews.concepts, "concept")} to review.`;
  }

  if (concept) {
    return "One new concept today.";
  }

  return nextDue
    ? `Nothing is due today. Your next review is ${inDays(nextDue)}.`
    : "Nothing is left to do in this course.";
};

/** The blocks of the session ahead, in the order they come. */
const Plan = ({ today }: { today: Today }) => {
  const { reviews, concept } = today;

  if (!reviews.tasks && !concept) {
    return (
      <Card>
        <PlanRow
          detail="Come back when a review is due."
          icon={Check}
          title="All done for today"
        />
      </Card>
    );
  }

  return (
    <Card>
      {reviews.tasks > 0 && (
        <PlanRow
          detail={`${plural(reviews.concepts, "concept")} ${reviews.concepts === 1 ? "is" : "are"} due. ${plural(reviews.tasks, "task")} ${reviews.tasks === 1 ? "covers" : "cover"} them.`}
          icon={RotateCcw}
          title="Review"
        />
      )}
      {concept && concept.guided > 0 && (
        <PlanRow
          detail={`See the example, then ${plural(concept.guided, "short task")}.`}
          icon={Sparkles}
          title="New concept"
        />
      )}
      {concept && concept.solo > 0 && (
        <PlanRow
          detail={`${plural(concept.solo, "task")} with the lesson closed.`}
          icon={User}
          title="On your own"
        />
      )}
    </Card>
  );
};

interface TodayScreenProps {
  /** The open course. */
  course: Course;
  today: Today;
  /** The hour of the day, for the greeting. */
  hour: number;
  /** The session length the learner picked, in minutes. */
  minutes: number;
  onMinutes: (minutes: number) => void;
  onStart: () => void;
  /** Open the list of all concepts. */
  onConcepts: () => void;
}

/** What today's session holds, and where the learner stands in the course. */
export const TodayScreen = ({
  course,
  today,
  hour,
  minutes,
  onMinutes,
  onStart,
  onConcepts,
}: TodayScreenProps) => {
  const ready = Boolean(today.reviews.tasks || today.concept);

  useEnter(onStart, ready);

  const { progress, memory } = today;
  const learned = progress.stable + progress.learning;

  return (
    <SessionPane>
      <SessionBar />
      <SessionBody centred>
        <Hero
          chip={
            <>
              <b>{greeting(hour)}</b> Day {today.day}
            </>
          }
          lead={summary(today)}
          title={
            today.concept?.name ??
            (today.reviews.concepts ? "Reviews" : "All caught up")
          }
        >
          <Button disabled={!ready} variant="primary" onClick={onStart}>
            Start session
          </Button>
          <LengthPicker
            options={LENGTHS}
            value={minutes}
            onChange={onMinutes}
          />
          <Button variant="ghost" onClick={onConcepts}>
            All concepts
          </Button>
        </Hero>
        <CardColumns>
          <Plan today={today} />
          <CardStack>
            <Card
              label={`Progress in ${course.subject.name}`}
              title={`${learned} of ${plural(progress.total, "concept")}`}
            >
              <Progress
                label="Concepts learned"
                value={progress.total ? learned / progress.total : 0}
              />
              <Figures
                items={[
                  { label: "Stable", value: progress.stable },
                  { label: "Learning", value: progress.learning },
                  { label: "To learn", value: progress.total - learned },
                ]}
              />
            </Card>
            <Card label="Memory">
              {memory === null ? (
                <Figure value="–">No reviews yet.</Figure>
              ) : (
                <Figure value={`${Math.round(memory * 100)}%`}>
                  of learned concepts you would recall now
                </Figure>
              )}
            </Card>
          </CardStack>
        </CardColumns>
      </SessionBody>
    </SessionPane>
  );
};
