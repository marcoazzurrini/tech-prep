import { Check, Circle, GripVertical, X } from "lucide-react";
import { useState } from "react";
import type {
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

import { cx } from "../lib/cx";
import type { Tone } from "./chip";
import { PaneSection } from "./lesson-pane";

import "./exercise.css";

type AnswerInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Green once the answer was right, red once it was wrong. */
  tone?: Tone;
};

/** The short answer box for predict-the-output. */
export const AnswerInput = ({ tone, ...props }: AnswerInputProps) => (
  <input {...props} className={cx("tp-answer", tone && `tp-answer--${tone}`)} />
);

/** The box for an answer in the learner's own words. */
export const AnswerText = (
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) => <textarea rows={6} {...props} className="tp-answer-text" />;

interface LineSlotProps {
  code: string;
  /** 1-based position once placed; leave out for a spare line. */
  index?: number;
  /** A line that is not needed in the answer. */
  spare?: boolean;
}

/** One line in arrange-the-lines, as it looks at rest. */
export const LineSlot = ({ code, index, spare = false }: LineSlotProps) => (
  <div className={cx("tp-line-slot", spare && "tp-line-slot--spare")}>
    <GripVertical size={14} aria-hidden />
    <code>{code}</code>
    {index !== undefined && (
      <span className="tp-line-slot__index">{index}</span>
    )}
  </div>
);

interface ArrangerProps {
  /** The learner's program, top to bottom. */
  lines: string[];
  /** Lines the learner set aside as not needed. */
  spare: string[];
  onChange: (lines: string[], spare: string[]) => void;
  /** Locked once the answer is handed in. */
  disabled?: boolean;
}

/**
 * Arrange-the-lines: drag a line to reorder it or to set it aside. With the keyboard, the
 * arrow keys move the focused line and Enter moves it between the two lists.
 */
export const Arranger = ({
  lines,
  spare,
  onChange,
  disabled = false,
}: ArrangerProps) => {
  const [dragging, setDragging] = useState<string | null>(null);

  /** Put `line` in the chosen list, before `before` or at the end. */
  const place = (line: string, toSpare: boolean, before?: string) => {
    if (line === before) {
      return;
    }

    const next = {
      lines: lines.filter((l) => l !== line),
      spare: spare.filter((l) => l !== line),
    };

    const list = toSpare ? next.spare : next.lines;
    const at = before === undefined ? -1 : list.indexOf(before);
    list.splice(at === -1 ? list.length : at, 0, line);
    onChange(next.lines, next.spare);
  };

  const onKey = (
    e: KeyboardEvent<HTMLButtonElement>,
    line: string,
    inSpare: boolean
  ) => {
    const list = inSpare ? spare : lines;
    const at = list.indexOf(line);

    if (e.key === "Enter") {
      e.preventDefault();
      place(line, !inSpare);
    } else if (e.key === "ArrowUp" && at > 0) {
      e.preventDefault();
      place(line, inSpare, list[at - 1]);
    } else if (e.key === "ArrowDown" && at < list.length - 1) {
      e.preventDefault();
      place(line, inSpare, list[at + 2]);
    }
  };

  const slot = (line: string, i: number, inSpare: boolean): ReactNode => (
    <li key={line}>
      <button
        aria-label={`${line}. Arrow keys move it. Enter ${inSpare ? "puts it back" : "sets it aside"}.`}
        className={cx(
          "tp-line-slot",
          "tp-line-slot--movable",
          inSpare && "tp-line-slot--spare",
          dragging === line && "tp-line-slot--dragging"
        )}
        disabled={disabled}
        draggable={!disabled}
        type="button"
        onDragEnd={() => setDragging(null)}
        onDragOver={(e) => e.preventDefault()}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          setDragging(line);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (dragging) {
            place(dragging, inSpare, line);
          }
        }}
        onKeyDown={(e) => onKey(e, line, inSpare)}
      >
        <GripVertical size={14} aria-hidden />
        <code>{line}</code>
        {!inSpare && <span className="tp-line-slot__index">{i + 1}</span>}
      </button>
    </li>
  );

  const list = (items: string[], inSpare: boolean) => (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the list is a drop target for the mouse; the keyboard moves lines with the buttons inside it.
    <ul
      className="tp-line-list"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();

        if (dragging) {
          place(dragging, inSpare);
        }
      }}
    >
      {items.map((line, i) => slot(line, i, inSpare))}
      {items.length === 0 && (
        <li className="tp-line-list__empty">
          {inSpare
            ? "Drag a line here if it is not needed."
            : "Drag lines here."}
        </li>
      )}
    </ul>
  );

  return (
    <>
      <PaneSection>{list(lines, false)}</PaneSection>
      <PaneSection label="Not needed">{list(spare, true)}</PaneSection>
    </>
  );
};

interface ResultCardProps {
  tone: Tone;
  /** The verdict in a few words, such as "It prints 5". */
  title: string;
  /** Why, in a sentence or two. */
  children?: ReactNode;
  /** What this means for the learner's progress. */
  note?: ReactNode;
}

/** The verdict under an answer. The dot carries the colour; the words carry the meaning. */
export const ResultCard = ({
  tone,
  title,
  children,
  note,
}: ResultCardProps) => (
  <output className="tp-result">
    <h3>
      <i className={`tp-dot tp-dot--${tone}`} aria-hidden />
      {title}
    </h3>
    {children && <div className="tp-result__body">{children}</div>}
    {note && <p className="tp-result__note">{note}</p>}
  </output>
);

export type TestStatus = "pending" | "pass" | "fail";

const TEST = {
  fail: { icon: X, label: "Failed" },
  pass: { icon: Check, label: "Passed" },
  pending: { icon: Circle, label: "Not run" },
};

interface TestRowProps {
  name: string;
  status: TestStatus;
  /** What went wrong, such as "expected 2 items, got 3". */
  detail?: string;
}

export const TestRow = ({ name, status, detail }: TestRowProps) => {
  const { icon: StatusIcon, label } = TEST[status];

  return (
    <div className={cx("tp-test", `tp-test--${status}`)}>
      <StatusIcon size={14} aria-label={label} />
      <span>{name}</span>
      {detail && <code>{detail}</code>}
    </div>
  );
};
