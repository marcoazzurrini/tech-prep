export function leaderboardOrder(entries) {
  const total = (entry) => entry.points + (entry.bonus ?? 0);

  return entries
    .toSorted((a, b) => total(b) - total(a) || a.name.length - b.name.length)
    .map((entry) => entry.name);
}
