import type { ReactNode } from "react";

import { cx } from "../lib/cx";

import "./lesson-pane.css";

/** The main pane: top bar, then the exercise. */
export const LessonPane = ({ children }: { children: ReactNode }) => (
  <main className="tp-lesson-pane">{children}</main>
);

interface PaneBodyProps {
  children: ReactNode;
  /** Take part of the height and leave the rest to an editor below. */
  share?: boolean;
}

/** A scrolling region inside the lesson pane. */
export const PaneBody = ({ children, share = false }: PaneBodyProps) => (
  <div className={cx("tp-pane-body", share && "tp-pane-body--share")}>
    {children}
  </div>
);

interface TaskHeaderProps {
  title: string;
  description?: ReactNode;
  /** Chips for the concepts this exercise practises. */
  chips?: ReactNode;
}

export const TaskHeader = ({ title, description, chips }: TaskHeaderProps) => (
  <section className="tp-task">
    <h1>{title}</h1>
    {description && <p>{description}</p>}
    {chips && <div className="tp-task__chips">{chips}</div>}
  </section>
);

/** A padded block for the answer area under the task. */
export const PaneSection = ({
  children,
  label,
  dock = false,
}: {
  children: ReactNode;
  label?: ReactNode;
  /** Sit under an editor at a fixed share of the height, scrolling inside. */
  dock?: boolean;
}) => (
  <section className={cx("tp-pane-section", dock && "tp-pane-section--dock")}>
    {label && <h2>{label}</h2>}
    {children}
  </section>
);

interface PaneFooterProps {
  /** A status note, kept on the left. */
  start?: ReactNode;
  children: ReactNode;
}

export const PaneFooter = ({ start, children }: PaneFooterProps) => (
  <footer className="tp-pane-footer">
    {start}
    <span className="tp-pane-footer__spacer" />
    {children}
  </footer>
);

export const EmptyState = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <div className="tp-empty">
    <h1>{title}</h1>
    {children && <p>{children}</p>}
  </div>
);
