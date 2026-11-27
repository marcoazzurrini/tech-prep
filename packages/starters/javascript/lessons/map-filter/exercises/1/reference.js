export function withRank(players) {
  return players.map((player, index) => ({ ...player, rank: index + 1 }));
}
