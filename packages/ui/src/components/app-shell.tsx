import type { ReactNode } from "react";

import { cx } from "../lib/cx";

import "./app-shell.css";

interface AppShellProps {
  rail: ReactNode;
  /** The lessons column. Leave it out for a focused screen, such as a review. */
  nav?: ReactNode;
  /** The lesson pane. */
  children: ReactNode;
  tutor?: ReactNode;
  /** The tutor stays mounted while hidden, so a running chat keeps its state. */
  tutorOpen?: boolean;
}

/** The course layout: icon rail, lessons, the lesson itself and the tutor. Without the lessons column it is a focused screen. */
export const AppShell = ({
  rail,
  nav,
  children,
  tutor,
  tutorOpen = true,
}: AppShellProps) => (
  <div
    className={cx(
      "tp-shell",
      !nav && "tp-shell--focus",
      Boolean(tutor) && tutorOpen && "tp-shell--tutor"
    )}
  >
    {rail}
    {nav}
    {children}
    {tutor && (
      <div className="tp-shell__tutor" hidden={!tutorOpen}>
        {tutor}
      </div>
    )}
  </div>
);
