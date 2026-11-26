export function longestStreak(results) {
  let best = 0;
  let streak = 0;

  for (const result of results) {
    if (result === "win") {
      streak = streak + 1;
    } else {
      streak = 0;
    }

    if (streak > best) {
      best = streak;
    }
  }

  return best;
}
