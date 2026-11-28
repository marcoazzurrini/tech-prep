import { CircleCheck, CircleDot, CircleX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";
import { TutorToggle } from "./top-bar";

import "./session.css";

/** The main pane of a session: a top bar, then one thing at a time in a centred column. */
export const SessionPane = ({ children }: { children: ReactNode }) => (
  <main className="tp-session">{children}</main>
);

interface SessionBarProps {
  /** What the learner is doing now, such as "Review" or "New concept". */
  block?: { icon: LucideIcon; label: string };
  /** How much of the session's time is used, from 0 to 1, and what is left in words. */
  time?: { used: number; label: string };
  /** Extra controls before the tutor toggle, such as "End session". */
  actions?: ReactNode;
  tutorOpen?: boolean;
  /** Left out on a screen with no tutor beside it. */
  onToggleTutor?: () => void;
}

/** The top bar of a session. It names the block and the time left, and nothing about the course. */
export const SessionBar = ({
  block,
  time,
  actions,
  tutorOpen = false,
  onToggleTutor,
}: SessionBarProps) => (
  <header className="tp-session-bar">
    {block && (
      <span className="tp-session-bar__block">
        <block.icon size={12} aria-hidden />
        {block.label}
      </span>
    )}
    <span className="tp-session-bar__spacer" />
    {time && (
      <span className="tp-session-bar__time">
        <span className="tp-session-bar__meter" aria-hidden>
          <span style={{ width: `${Math.min(1, time.used) * 100}%` }} />
        </span>
        {time.label}
      </span>
    )}
    {actions}
    {onToggleTutor && (
      <>
        <span className="tp-session-bar__divider" />
        <TutorToggle open={tutorOpen} onToggle={onToggleTutor} />
      </>
    )}
  </header>
);

interface SessionBodyProps {
  children: ReactNode;
  /** Pinned under the column: the answer, or the button that moves on. */
  footer?: ReactNode;
  /** Centre the content, for a screen that is read at a glance. */
  centred?: boolean;
  /** Give the footer the room the column leaves, for an answer of many lines. */
  grow?: boolean;
}

/** The centred column of a session. What is above the footer scrolls. */
export const SessionBody = ({
  children,
  footer,
  centred = false,
  grow = false,
}: SessionBodyProps) => (
  <div className={cx("tp-session-body", grow && "tp-session-body--grow")}>
    <div
      className={cx(
        "tp-session-body__column",
        centred && "tp-session-body__column--centred"
      )}
    >
      {children}
    </div>
    {footer && <div className="tp-session-body__footer">{footer}</div>}
  </div>
);

/** A row at the foot of the column: a quiet action on the left, the way on at the right. */
export const SessionActions = ({
  start,
  children,
  centred = false,
}: {
  start?: ReactNode;
  children: ReactNode;
  /** Put the one action in the middle, under a centred screen. */
  centred?: boolean;
}) => (
  <div
    className={cx(
      "tp-session-actions",
      centred && "tp-session-actions--centred"
    )}
  >
    {start}
    {!centred && <span className="tp-session-bar__spacer" />}
    {children}
  </div>
);

/** The small buttons under a task, such as "Hint" and "I don't know". */
export const SessionHelp = ({ children }: { children: ReactNode }) => (
  <div className="tp-session-help">{children}</div>
);

/** Panels side by side in one box: the input, the learner's output, the wanted output. */
export const RunPanels = ({ children }: { children: ReactNode }) => (
  <div className="tp-run">{children}</div>
);

/** A line under the work that says how the last answer went. */
export const SessionNote = ({ children }: { children: ReactNode }) => (
  <p className="tp-session-note">{children}</p>
);

interface HeroProps {
  /** A small pill above the title, such as "Good morning. Day 12". */
  chip?: ReactNode;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}

/** The large centred opening of the Today and Done screens. */
export const Hero = ({ chip, title, lead, children }: HeroProps) => (
  <section className="tp-hero">
    {chip && <p className="tp-hero__chip">{chip}</p>}
    <h1>{title}</h1>
    {lead && <p className="tp-hero__lead">{lead}</p>}
    {children && <div className="tp-hero__actions">{children}</div>}
  </section>
);

/** A quiet centred line under the figures of a summary. */
export const HeroNote = ({ children }: { children: ReactNode }) => (
  <p className="tp-hero__note">{children}</p>
);

interface LengthPickerProps {
  /** Session lengths in minutes. */
  options: number[];
  value: number;
  onChange: (minutes: number) => void;
}

/** How long the session is. One length is picked at a time. */
export const LengthPicker = ({
  options,
  value,
  onChange,
}: LengthPickerProps) => (
  <fieldset aria-label="Session length" className="tp-length">
    {options.map((minutes) => (
      <button
        aria-pressed={minutes === value}
        className={cx(
          "tp-length__option",
          minutes === value && "tp-length__option--on"
        )}
        key={minutes}
        type="button"
        onClick={() => onChange(minutes)}
      >
        {minutes} min
      </button>
    ))}
  </fieldset>
);

/** A card on the raised surface. */
export const Card = ({
  label,
  title,
  children,
}: {
  /** A quiet line that names the card. */
  label?: string;
  /** The card's main line, under its label. */
  title?: string;
  children: ReactNode;
}) => (
  <section className="tp-card">
    {label && <h2 className="tp-card__label">{label}</h2>}
    {title && <p className="tp-card__title">{title}</p>}
    {children}
  </section>
);

/** Cards in a row: a wide one, then a narrow column. */
export const CardColumns = ({ children }: { children: ReactNode }) => (
  <div className="tp-card-columns">{children}</div>
);

/** Cards one above the other. */
export const CardStack = ({ children }: { children: ReactNode }) => (
  <div className="tp-card-stack">{children}</div>
);

interface PlanRowProps {
  icon: LucideIcon;
  title: string;
  detail: string;
}

/** One block of the session ahead: its icon, its name and what it holds. */
export const PlanRow = ({ icon: Icon, title, detail }: PlanRowProps) => (
  <div className="tp-plan-row">
    <span className="tp-plan-row__icon">
      <Icon size={16} aria-hidden />
    </span>
    <div>
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  </div>
);

/** Figures side by side, each a number over its label. */
export const Figures = ({
  items,
  large = false,
}: {
  items: { value: ReactNode; label: string }[];
  /** Each figure in a card of its own, for a closing summary. */
  large?: boolean;
}) => (
  <dl className={cx("tp-figures", large && "tp-figures--cards")}>
    {items.map((item) => (
      <div key={item.label}>
        <dd>{item.value}</dd>
        <dt>{item.label}</dt>
      </div>
    ))}
  </dl>
);

/** A large figure with a line of words beside it. */
export const Figure = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => (
  <p className="tp-figure">
    <b>{value}</b>
    <span>{children}</span>
  </p>
);

const MARKS = {
  fail: CircleX,
  learning: CircleDot,
  pass: CircleCheck,
};

interface CreditRowProps {
  /** Pass and fail are a review's result. Learning is a concept still being taught. */
  tone: keyof typeof MARKS;
  name: string;
  /** What the answer changed, in a few words. */
  effect: string;
}

export const CreditRow = ({ tone, name, effect }: CreditRowProps) => {
  const Mark = MARKS[tone];

  return (
    <li className={`tp-credit__row tp-credit__row--${tone}`}>
      <Mark size={16} aria-hidden />
      <span className="tp-credit__name">{name}</span>
      <span className="tp-credit__effect">{effect}</span>
    </li>
  );
};

/** What a finished task practised: one row per concept, shown only after the answer. */
export const Credit = ({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) => (
  <section className="tp-credit">
    <header>
      <h3>{title}</h3>
      {note && <span>{note}</span>}
    </header>
    <ul>{children}</ul>
  </section>
);
