import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { cx } from "../lib/cx";

import "./button.css";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  type?: "button" | "submit";
  /** Primary is the one light fill on a screen. */
  variant?: "primary" | "secondary" | "ghost";
  /** Large is for the one action that starts a screen's work, such as "Review all". */
  size?: "regular" | "large";
  icon?: LucideIcon;
  /** An icon after the label, such as an arrow on a button that moves on. */
  iconEnd?: LucideIcon;
};

export const Button = ({
  variant = "secondary",
  size = "regular",
  icon: IconComponent,
  iconEnd: IconEnd,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cx(
      "tp-button",
      `tp-button--${variant}`,
      size === "large" && "tp-button--large",
      className
    )}
    type={type === "submit" ? "submit" : "button"}
  >
    {IconComponent && <IconComponent size={14} aria-hidden />}
    {children}
    {IconEnd && <IconEnd size={14} aria-hidden />}
  </button>
);

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  /** Read by screen readers and shown as the tooltip. */
  label: string;
  icon: LucideIcon;
  /** Outline is round with a border; ghost is a quiet square. */
  variant?: "outline" | "ghost";
};

export const IconButton = ({
  label,
  icon: IconComponent,
  variant = "outline",
  className,
  ...props
}: IconButtonProps) => (
  <button
    {...props}
    aria-label={label}
    className={cx("tp-icon-button", `tp-icon-button--${variant}`, className)}
    title={label}
    type="button"
  >
    <IconComponent size={14} aria-hidden />
  </button>
);
