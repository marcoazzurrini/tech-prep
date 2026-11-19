import type { ComponentType, ReactNode } from "react";

import { JqInput, JqWorkbench } from "./jq-workbench";
import type { Problem, TaskView } from "./types";
import { Workbench } from "./workbench";
import type { Finished } from "./workbench";

/** What every kind of workbench takes. The screens use these and never ask the kind. */
export interface WorkbenchProps {
  problem: Problem;
  /**
   * Show the statement above the editor. Only a compact kind does: it is set when the
   * statement is not shown elsewhere on the screen.
   */
  strip?: { label: string };
  /** Shown on the left of the footer while the learner works. */
  note?: string;
  /** Open the tutor pane, for when the learner asks for a hint. */
  onAskTutor: () => void;
  /** Called once, when the task is solved or given up. */
  onFinished: (finished: Finished) => void;
  /** Once finished: the footer's note and its buttons, such as "Next lesson". */
  done?: { note: string; actions: ReactNode };
}

/** How the app shows one kind of task. A new kind of course adds one entry. */
interface TaskKind {
  Workbench: ComponentType<WorkbenchProps>;
  /** What a task shows under its statement, such as its input. */
  Aside?: ComponentType<{ problem: Problem }>;
  /**
   * True for short tasks: the statement sits beside the editor and a lesson's guided task
   * sits above it. Otherwise the statement gets a column of its own.
   */
  compact: boolean;
}

const KINDS: Record<TaskView["kind"], TaskKind> = {
  code: { Workbench, compact: false },
  jq: { Aside: JqInput, Workbench: JqWorkbench, compact: true },
};

const kindOf = (problem: Problem): TaskKind =>
  KINDS[problem.task?.kind ?? "code"];

/** True when the task's statement sits beside its editor. */
export const isCompact = (problem: Problem): boolean => kindOf(problem).compact;

/** The editor, the checks and the footer for a task, whatever its kind. */
export const TaskWorkbench = (props: WorkbenchProps) => {
  const { Workbench: Bench } = kindOf(props.problem);

  return <Bench {...props} />;
};

/** What a task shows under its statement, if its kind shows anything. */
export const TaskAside = ({ problem }: { problem: Problem }) => {
  const { Aside } = kindOf(problem);

  return Aside ? <Aside problem={problem} /> : null;
};
