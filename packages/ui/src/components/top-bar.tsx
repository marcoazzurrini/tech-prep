import { ChevronLeft, ChevronRight, PanelRight } from "lucide-react";

import { cx } from "../lib/cx";
import { IconButton } from "./button";

import "./top-bar.css";

interface TopBarProps {
  chapter: string;
  lesson: string;
  /** Such as "Lesson 2 of 5". */
  position?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  tutorOpen: boolean;
  onToggleTutor: () => void;
}

export const TopBar = ({
  chapter,
  lesson,
  position,
  onPrevious,
  onNext,
  tutorOpen,
  onToggleTutor,
}: TopBarProps) => (
  <header className="tp-top-bar">
    <span className="tp-top-bar__chapter">{chapter}</span>
    <ChevronRight className="tp-top-bar__sep" size={13} aria-hidden />
    <span className="tp-top-bar__lesson">{lesson}</span>
    {position && <span className="tp-top-bar__position">{position}</span>}
    <IconButton
      disabled={!onPrevious}
      icon={ChevronLeft}
      label="Previous lesson"
      onClick={onPrevious}
    />
    <IconButton
      disabled={!onNext}
      icon={ChevronRight}
      label="Next lesson"
      onClick={onNext}
    />
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
