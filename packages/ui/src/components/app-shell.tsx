import type { ReactNode } from "react";

import { cx } from "../lib/cx";

import "./app-shell.css";

interface AppShellProps {
  rail: ReactNode;
  /** The main pane: one screen of a session. */
  children: ReactNode;
  tutor?: ReactNode;
  /** The tutor stays mounted while hidden, so a running chat keeps its state. */
  tutorOpen?: boolean;
}

/** The app's layout: the icon rail, the main pane and the tutor. Nothing beside the work names its topic. */
export const AppShell = ({
  rail,
  children,
  tutor,
  tutorOpen = true,
}: AppShellProps) => (
  <div
    className={cx("tp-shell", Boolean(tutor) && tutorOpen && "tp-shell--tutor")}
  >
    {rail}
    {children}
    {tutor && (
      <div className="tp-shell__tutor" hidden={!tutorOpen}>
        {tutor}
      </div>
    )}
  </div>
);
