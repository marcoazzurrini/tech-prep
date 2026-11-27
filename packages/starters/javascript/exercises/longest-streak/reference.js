export function longestStreak(log, goal) {
  const { best } = log.reduce(
    ({ current, best }, { minutes }) => {
      const next = minutes >= goal ? current + 1 : 0;
      return { current: next, best: Math.max(best, next) };
    },
    { current: 0, best: 0 },
  );

  return best;
}
