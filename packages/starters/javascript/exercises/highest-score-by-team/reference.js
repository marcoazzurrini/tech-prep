export function highestScoreByTeam(players) {
  return players.reduce((acc, player) => {
    const team = player.team ?? "unassigned";
    if (!(team in acc) || player.score > acc[team]) {
      acc[team] = player.score;
    }
    return acc;
  }, Object.create(null));
}
