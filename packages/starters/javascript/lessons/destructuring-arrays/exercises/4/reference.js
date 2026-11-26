export function firstWinner(result) {
  const [winner = "nobody"] = result.winners ?? [];

  return winner;
}
