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

/** "tomorrow", "in 4 days": how far away a review is, in whole days. */
export const inDays = (iso: string): string => {
  const days = Math.max(
    0,
    Math.round((Date.parse(iso) - Date.now()) / 86_400_000)
  );

  if (days === 0) {
    return "today";
  }

  return days === 1 ? "tomorrow" : `in ${days} days`;
};

/** Call the engine bridge and read its reply as `T`. */
export const engine = async <T>(
  method: Parameters<typeof window.tp.engine>[0],
  params?: Parameters<typeof window.tp.engine>[1]
): Promise<T> =>
  // SAFETY: each bridge method returns the shape its caller names; the shapes are in types.ts.
  (await window.tp.engine(method, params)) as T;
