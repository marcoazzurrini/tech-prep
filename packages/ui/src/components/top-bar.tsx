import { ChevronRight, PanelRight } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";

import "./top-bar.css";

/** Opens and closes the tutor pane. It is tinted while the pane is open. */
export const TutorToggle = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) => (
  <button
    aria-pressed={open}
    className={cx("tp-tutor-toggle", open && "tp-tutor-toggle--on")}
    title="Tutor (⌘L)"
    type="button"
    onClick={onToggle}
  >
    <PanelRight size={14} aria-hidden />
    Tutor
  </button>
);

interface TopBarProps {
  /** The chapter or section the page belongs to. Leave it out when naming it would give a review away. */
  chapter?: string;
  /** The page's name. */
  lesson?: string;
  /** Extra controls before the tutor toggle, such as "End reviews". */
  actions?: ReactNode;
  tutorOpen: boolean;
  onToggleTutor: () => void;
}

export const TopBar = ({
  chapter,
  lesson,
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
    {actions}
    <span className="tp-top-bar__divider" />
    <TutorToggle open={tutorOpen} onToggle={onToggleTutor} />
  </header>
);
