import type { Difficulty } from "./types";

export const DIFFICULTY: Record<Difficulty, string> = {
  easy: "Easy",
  hard: "Hard",
  medium: "Medium",
};

/** "Friday 20 November", for a date the learner should come back on. */
export const formatDay = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

/** The start of a date's day, on the learner's clock. */
const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "tomorrow", "in 4 days": how many days away a review is. A review is due for its whole day. */
export const inDays = (iso: string, now = new Date()): string => {
  const days = Math.max(
    0,
    Math.round((startOfDay(new Date(iso)) - startOfDay(now)) / 86_400_000)
  );

  if (days === 0) {
    return "today";
  }

  return days === 1 ? "tomorrow" : `in ${days} days`;
};

/** Call the engine bridge. The contract types what each method takes and answers. */
export const engine: typeof window.tp.engine = (method, ...params) =>
  window.tp.engine(method, ...params);
