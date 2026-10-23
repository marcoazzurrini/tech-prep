import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";

import "./chip.css";

export type Tone = "green" | "amber" | "red";

interface ChipProps {
  children: ReactNode;
  /** A coloured dot reports a result. Colour never stands alone: the words say it too. */
  tone?: Tone;
  icon?: LucideIcon;
  /** Muted chips hold background facts, such as a concept that is not the focus. */
  muted?: boolean;
}

export const Chip = ({
  children,
  tone,
  icon: IconComponent,
  muted = false,
}: ChipProps) => (
  <span className={cx("tp-chip", muted && "tp-chip--muted")}>
    {tone && <i className={`tp-dot tp-dot--${tone}`} aria-hidden />}
    {IconComponent && <IconComponent size={13} aria-hidden />}
    {children}
  </span>
);
