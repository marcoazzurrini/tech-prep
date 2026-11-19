import type { ComponentType, ReactNode } from "react";

import { CommandAside, CommandWorkbench } from "./command-workbench";
import { FunctionWorkbench } from "./function-workbench";
import type { Finished } from "./lesson-flow";
import type { CheckView, Problem } from "./types";
import { ValueAside, ValueWorkbench } from "./value-workbench";

/** What every workbench takes. The screens use these and never ask how an exercise is checked. */
export interface WorkbenchProps {
  problem: Problem;
  /**
   * Show the statement above the answer. Only a compact workbench does: it is set when the
   * statement is not shown elsewhere on the screen.
   */
  strip?: { label: string };
  /** Shown on the left of the footer while the learner works. */
  note?: string;
  /** Open the tutor pane, for when the learner asks for a hint. */
  onAskTutor: () => void;
  /** Called once, when the exercise is solved or given up. */
  onFinished: (finished: Finished) => void;
  /** Once finished: the footer's note and its buttons, such as "Next lesson". */
  done?: { note: string; actions: ReactNode };
}

/** How the app takes an answer for one way of checking it. A new checker adds one entry. */
interface Bench {
  Workbench: ComponentType<WorkbenchProps>;
  /** What the exercise shows under its statement, such as its input. */
  Aside?: ComponentType<{ problem: Problem }>;
  /**
   * True for short answers: the statement sits beside the answer, and a lesson's guided
   * exercise sits above it. Otherwise the statement gets a column of its own.
   */
  compact: boolean;
}

const FUNCTION: Bench = { Workbench: FunctionWorkbench, compact: false };

/**
 * The workbench for each check. Null for a check that is only shown as an extra exercise
 * from the tutor: the engine never puts one in a course.
 */
const BENCHES: Record<CheckView["type"], Bench | null> = {
  answer: null,
  arrange: null,
  command: {
    Aside: CommandAside,
    Workbench: CommandWorkbench,
    compact: true,
  },
  function: FUNCTION,
  read: null,
  value: { Aside: ValueAside, Workbench: ValueWorkbench, compact: true },
};

/** An exercise that is not written yet has no check. It is laid out as code. */
const benchOf = (problem: Problem): Bench =>
  (problem.check && BENCHES[problem.check.type]) ?? FUNCTION;

/** True when the exercise's statement sits beside its answer. */
export const isCompact = (problem: Problem): boolean =>
  benchOf(problem).compact;

/** The answer area, the result and the footer for an exercise, however it is checked. */
export const ExerciseWorkbench = (props: WorkbenchProps) => {
  const { Workbench } = benchOf(props.problem);

  return <Workbench {...props} />;
};

/** What an exercise shows under its statement, if its check shows anything. */
export const ExerciseAside = ({ problem }: { problem: Problem }) => {
  const { Aside } = benchOf(problem);

  return Aside ? <Aside problem={problem} /> : null;
};
