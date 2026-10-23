import type { ReactNode } from "react";

import "./lesson-pane.css";

/** The main pane: top bar, then the exercise. */
export const LessonPane = ({ children }: { children: ReactNode }) => (
  <main className="tp-lesson-pane">{children}</main>
);

/** A scrolling region inside the lesson pane. */
export const PaneBody = ({ children }: { children: ReactNode }) => (
  <div className="tp-pane-body">{children}</div>
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
}: {
  children: ReactNode;
  label?: string;
}) => (
  <section className="tp-pane-section">
    {label && <h2>{label}</h2>}
    {children}
  </section>
);

interface PaneFooterProps {
  /** Secondary actions, kept on the left. */
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
