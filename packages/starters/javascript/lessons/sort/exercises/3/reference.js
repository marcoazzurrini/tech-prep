export function rankPlayers(players) {
  return players
    .toSorted((a, b) => b.score - a.score || a.id - b.id)
    .map((player) => player.name);
}
