import type { JqTask, Problem } from "@tech-prep/engine/contract";

import type { Api } from "../../preload/index";

declare global {
  interface Window {
    tp: Api;
  }
}

export type * from "@tech-prep/engine/contract";

/** The jq part of a problem, when its course's tasks are jq commands. */
export const jqOf = (problem: Problem): JqTask | null =>
  problem.task?.kind === "jq" ? problem.task : null;
