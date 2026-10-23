import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";

import "./rail.css";

/** The collapsed sidebar: app mark, shortcuts and one button per subject. */
export const Rail = ({ children }: { children: ReactNode }) => (
  <nav aria-label="Main" className="tp-rail">
    <span className="tp-rail__logo" aria-hidden>
      <Check size={13} strokeWidth={3} />
    </span>
    {children}
  </nav>
);

interface RailItemProps {
  /** Shown as the tooltip and read by screen readers. */
  label: string;
  children: ReactNode;
  active?: boolean;
  /** A count such as due reviews, shown in a small pill. */
  count?: number;
  onClick?: () => void;
}

export const RailItem = ({
  label,
  children,
  active = false,
  count,
  onClick,
}: RailItemProps) => (
  <button
    aria-current={active ? "page" : undefined}
    aria-label={count ? `${label}, ${count}` : label}
    className={cx("tp-rail__item", active && "tp-rail__item--active")}
    title={label}
    type="button"
    onClick={onClick}
  >
    {children}
    {count ? <span className="tp-rail__count">{count}</span> : null}
  </button>
);

export const RailDivider = () => <hr className="tp-rail__divider" />;

/** Pushes the items after it to the bottom of the rail. */
export const RailSpacer = () => <span className="tp-rail__spacer" />;
