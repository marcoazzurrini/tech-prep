import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";
import { highlight } from "../lib/highlight";

import "./jq.css";

interface TaskStripProps {
  /** Such as "Try it". */
  label: string;
  title: string;
  /** The statement. */
  children?: ReactNode;
}

/** The task above a jq command: what to do. The top bar says which part of the lesson it is. */
export const TaskStrip = ({ label, title, children }: TaskStripProps) => (
  <section className="tp-task-strip">
    <p className="tp-task-strip__label">{label}</p>
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
  /** The file the text is in, shown after the label as it is spelled. */
  file?: string;
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
  file,
  state,
  text,
  empty,
}: OutputPanelProps) => {
  const shown = state && STATES[state];

  return (
    <section className="tp-output">
      <header>
        <h3>
          {label}
          {file && <code> · {file}</code>}
        </h3>
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

/** Panels one above the other, for a task with no output to compare. */
export const OutputStack = ({ children }: { children: ReactNode }) => (
  <div className="tp-output-stack">{children}</div>
);

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
