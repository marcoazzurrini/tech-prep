import { ChevronLeft, ChevronRight, PanelRight } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";
import { IconButton } from "./button";

import "./top-bar.css";

interface TopBarProps {
  /** The chapter or section the page belongs to. Leave it out when naming it would give a review away. */
  chapter?: string;
  lesson: string;
  /** Where the learner is in a short sequence, such as the two steps of a lesson. */
  steps?: { count: number; at: number };
  /** Such as "Step 1 of 2 · With the lesson". */
  position?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Extra controls before the tutor toggle, such as "End reviews". */
  actions?: ReactNode;
  tutorOpen: boolean;
  onToggleTutor: () => void;
}

interface StepsProps {
  count: number;
  /** The current step, from 0. Earlier steps are done. */
  at: number;
}

/** Dots joined by lines: done steps are green, the current one is larger. */
export const Steps = ({ count, at }: StepsProps) => (
  <ol aria-label={`Step ${at + 1} of ${count}`} className="tp-steps">
    {Array.from({ length: count }, (_, i) => (
      <li
        aria-current={i === at ? "step" : undefined}
        className={cx(
          "tp-steps__dot",
          i < at && "tp-steps__dot--done",
          i === at && "tp-steps__dot--current"
        )}
        key={i}
      />
    ))}
  </ol>
);

export const TopBar = ({
  chapter,
  lesson,
  steps,
  position,
  onPrevious,
  onNext,
  actions,
  tutorOpen,
  onToggleTutor,
}: TopBarProps) => (
  <header className="tp-top-bar">
    {chapter && (
      <>
        <span className="tp-top-bar__chapter">{chapter}</span>
        <ChevronRight className="tp-top-bar__sep" size={13} aria-hidden />
      </>
    )}
    <span className="tp-top-bar__lesson">{lesson}</span>
    {steps && <Steps at={steps.at} count={steps.count} />}
    {position && <span className="tp-top-bar__position">{position}</span>}
    {(onPrevious || onNext) && (
      <>
        <IconButton
          disabled={!onPrevious}
          icon={ChevronLeft}
          label="Previous step"
          onClick={onPrevious}
        />
        <IconButton
          disabled={!onNext}
          icon={ChevronRight}
          label="Next step"
          onClick={onNext}
        />
      </>
    )}
    {actions}
    <span className="tp-top-bar__divider" />
    <button
      aria-pressed={tutorOpen}
      className={cx("tp-tutor-toggle", tutorOpen && "tp-tutor-toggle--on")}
      title="Tutor (⌘L)"
      type="button"
      onClick={onToggleTutor}
    >
      <PanelRight size={14} aria-hidden />
      Tutor
    </button>
  </header>
);
