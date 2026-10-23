import { Check, Circle, GripVertical, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

import { cx } from "../lib/cx";

import "./exercise.css";

/** The short answer box for predict-the-output. */
export const AnswerInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="tp-answer" />
);

interface LineSlotProps {
  code: string;
  /** 1-based position once placed; leave out for a spare line. */
  index?: number;
  /** A line that is not needed in the answer. */
  spare?: boolean;
}

/** One draggable line in arrange-the-lines. */
export const LineSlot = ({ code, index, spare = false }: LineSlotProps) => (
  <div className={cx("tp-line-slot", spare && "tp-line-slot--spare")}>
    <GripVertical size={14} aria-hidden />
    <code>{code}</code>
    {index !== undefined && (
      <span className="tp-line-slot__index">{index}</span>
    )}
  </div>
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
