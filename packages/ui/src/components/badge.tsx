import { cx } from "../lib/cx";

import "./badge.css";

interface BadgeProps {
  /** Two or three characters, such as "TS" or "75". */
  initials: string;
  /** The current subject gets the light fill. */
  active?: boolean;
  size?: "sm" | "md";
}

/** A subject's initials in a small rounded square. */
export const Badge = ({
  initials,
  active = false,
  size = "md",
}: BadgeProps) => (
  <span
    aria-hidden
    className={cx(
      "tp-badge",
      `tp-badge--${size}`,
      active && "tp-badge--active"
    )}
  >
    {initials}
  </span>
);
