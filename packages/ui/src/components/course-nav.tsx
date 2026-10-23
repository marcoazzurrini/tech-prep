import {
  ChevronDown,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Lock,
} from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";
import { Progress } from "./progress";

import "./course-nav.css";

/** The column that lists a subject's chapters and lessons. */
export const CourseNav = ({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) => (
  <nav aria-label="Lessons" className="tp-course-nav">
    {header}
    <div className="tp-course-nav__list">{children}</div>
  </nav>
);

interface CourseHeaderProps {
  title: string;
  /** From 0 to 1. */
  progress: number;
  meta: string;
}

export const CourseHeader = ({ title, progress, meta }: CourseHeaderProps) => (
  <header className="tp-course-header">
    <h2>{title}</h2>
    <Progress label={`${title} progress`} value={progress} />
    <p>{meta}</p>
  </header>
);

interface ChapterProps {
  label: string;
  open?: boolean;
  /** Bold for the chapter that holds the current lesson. */
  current?: boolean;
  /** Every lesson done: a green tick replaces the count. */
  done?: boolean;
  /** Such as "2 / 5". */
  meta?: string;
  onToggle?: () => void;
  children?: ReactNode;
}

export const Chapter = ({
  label,
  open = false,
  current = false,
  done = false,
  meta,
  onToggle,
  children,
}: ChapterProps) => {
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div className="tp-chapter">
      <button
        aria-expanded={open}
        className={cx("tp-chapter__row", current && "tp-chapter__row--current")}
        type="button"
        onClick={onToggle}
      >
        <Chevron size={14} aria-hidden />
        <span className="tp-chapter__label">{label}</span>
        {done ? (
          <CircleCheck
            className="tp-chapter__done"
            size={14}
            aria-label="Done"
          />
        ) : (
          meta && <span className="tp-chapter__meta">{meta}</span>
        )}
      </button>
      {open && children && <ul className="tp-chapter__lessons">{children}</ul>}
    </div>
  );
};

export type LessonStatus = "done" | "partial" | "started" | "todo" | "locked";

const STATUS = {
  done: { icon: CircleCheck, label: "Done" },
  locked: { icon: Lock, label: "Locked" },
  partial: { icon: CircleCheck, label: "Done with help" },
  started: { icon: CircleDashed, label: "Started" },
  todo: { icon: Circle, label: "Not started" },
};

interface LessonProps {
  label: string;
  status: LessonStatus;
  /** The lesson the tutor is on. */
  current?: boolean;
  /** The lesson shown in the main pane. */
  selected?: boolean;
  /** Short trailing text, such as the difficulty. */
  meta?: string;
  onSelect?: () => void;
}

export const Lesson = ({
  label,
  status,
  current = false,
  selected = false,
  meta,
  onSelect,
}: LessonProps) => {
  const { icon: StatusIcon, label: statusLabel } = current
    ? { icon: CircleDot, label: "Current" }
    : STATUS[status];

  return (
    <li>
      <button
        aria-current={selected ? "page" : undefined}
        className={cx(
          "tp-lesson",
          `tp-lesson--${current ? "current" : status}`,
          selected && "tp-lesson--selected"
        )}
        disabled={status === "locked"}
        type="button"
        onClick={onSelect}
      >
        <StatusIcon
          className="tp-lesson__status"
          size={14}
          aria-label={statusLabel}
        />
        <span className="tp-lesson__label">{label}</span>
        {meta && <span className="tp-lesson__meta">{meta}</span>}
      </button>
    </li>
  );
};
