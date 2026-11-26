export function firstScores(entries) {
  const teams = {};

  for (const { team, player, score } of entries) {
    (teams[team] ??= {})[player] ??= score;
  }

  return teams;
}
