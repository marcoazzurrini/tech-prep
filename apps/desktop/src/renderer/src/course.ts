import type { Roadmap } from "./types";

type TopicProblem = Roadmap["topics"][number]["problems"][number];

export const DIFFICULTY = { easy: "Easy", hard: "Hard", medium: "Medium" };

/** Unlocked, or already started, so the learner can open it. */
export const isOpen = (p: TopicProblem): boolean =>
  p.unlocked || p.status !== "unattempted";

/** Concepts whose review is due today or earlier. */
export const dueCount = (roadmap: Roadmap): number => {
  const now = Date.now();

  return roadmap.topics
    .flatMap((t) => t.concepts)
    .filter((c) => c.due !== null && Date.parse(c.due) <= now).length;
};
