export function leaderboard(players) {
  const byScore = Map.groupBy(players, (player) => player.score);

  return [...byScore]
    .map(([score, group]) => [score, group.map((player) => player.name)])
    .sort((a, b) => b[0] - a[0]);
}
