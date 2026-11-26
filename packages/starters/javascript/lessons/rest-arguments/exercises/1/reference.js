export function teamLine(captain, ...players) {
  if (players.length === 0) {
    return `${captain} plays alone`;
  }

  return `${captain} leads ${players.join(", ")}`;
}
