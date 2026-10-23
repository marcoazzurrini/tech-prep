import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { cx } from "../lib/cx";

import "./button.css";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  type?: "button" | "submit";
  /** Primary is the one light fill on a screen. */
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
};

export const Button = ({
  variant = "secondary",
  icon: IconComponent,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cx("tp-button", `tp-button--${variant}`, className)}
    type={type === "submit" ? "submit" : "button"}
  >
    {IconComponent && <IconComponent size={14} aria-hidden />}
    {children}
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
