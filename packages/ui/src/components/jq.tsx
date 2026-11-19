import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";
import { highlight } from "../lib/highlight";

import "./jq.css";

interface TaskStripProps {
  /** Such as "Task 1 of 3 · with the lesson". */
  label: string;
  title: string;
  /** How many of the step's tasks are done, and how many there are. */
  tasks?: { done: number; total: number };
  /** The statement. */
  children?: ReactNode;
}

/** The task above a jq filter: which task it is, how many are left, and what to do. */
export const TaskStrip = ({
  label,
  title,
  tasks,
  children,
}: TaskStripProps) => (
  <section className="tp-task-strip">
    <div className="tp-task-strip__head">
      <p className="tp-task-strip__label">{label}</p>
      {tasks && tasks.total > 1 && (
        <span
          className="tp-task-strip__dots"
          aria-label={`${tasks.done} of ${tasks.total} done`}
        >
          {Array.from({ length: tasks.total }, (_, i) => (
            <i
              className={cx(
                i < tasks.done && "tp-task-strip__dot--done",
                i === tasks.done && "tp-task-strip__dot--now"
              )}
              key={i}
            />
          ))}
        </span>
      )}
    </div>
    <h2>{title}</h2>
    {children}
  </section>
);

export type OutputState = "matches" | "differs" | "error";

const STATES = {
  differs: { icon: CircleAlert, text: "Differs" },
  error: { icon: CircleX, text: "Error" },
  matches: { icon: CircleCheck, text: "Matches" },
};

interface OutputPanelProps {
  /** Such as "Input" or "Wanted output". */
  label: string;
  /** How the learner's output compares with the wanted one. */
  state?: OutputState;
  /** JSON or plain text, shown as jq prints it. */
  text: string;
  /** Shown in place of the text when there is none. */
  empty?: string;
}

/** One block of jq input or output, on the darkest surface. A jq error shows in red. */
export const OutputPanel = ({
  label,
  state,
  text,
  empty,
}: OutputPanelProps) => {
  const shown = state && STATES[state];

  return (
    <section className="tp-output">
      <header>
        <h3>{label}</h3>
        {shown && (
          <span className={`tp-output__state tp-output__state--${state}`}>
            <shown.icon size={14} aria-hidden />
            {shown.text}
          </span>
        )}
      </header>
      {text ? (
        <pre className={cx(state === "error" && "tp-output__text--error")}>
          {state === "error"
            ? text
            : text.split("\n").map((line, i) => (
                <span key={i}>
                  {highlight(line)}
                  {"\n"}
                </span>
              ))}
        </pre>
      ) : (
        <p className="tp-output__empty">{empty}</p>
      )}
    </section>
  );
};

interface OutputPanelsProps {
  /** The input, when it is not shown beside the statement. */
  input?: ReactNode;
  yours: ReactNode;
  wanted: ReactNode;
}

/** The panels under a jq filter: the input on the left, your output over the wanted output. */
export const OutputPanels = ({ input, yours, wanted }: OutputPanelsProps) => (
  <div className="tp-outputs">
    <div
      className={cx(
        "tp-outputs__grid",
        Boolean(input) && "tp-outputs__grid--input"
      )}
    >
      {input}
      <div className="tp-outputs__pair">
        {yours}
        {wanted}
      </div>
    </div>
  </div>
);
