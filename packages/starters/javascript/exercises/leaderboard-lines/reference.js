const place = new Intl.PluralRules("en-US", { type: "ordinal" });
const count = new Intl.PluralRules("en-US");
const number = new Intl.NumberFormat("en-US");
const suffixes = { one: "st", two: "nd", few: "rd", other: "th" };

export function leaderboard(players) {
  const ranked = players.toSorted(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name, "en")
  );

  return ranked.map((player, i) => {
    const position = `${i + 1}${suffixes[place.select(i + 1)]}`;
    const word = count.select(player.points) === "one" ? "point" : "points";
    return `${position} ${player.name}: ${number.format(player.points)} ${word}`;
  });
}
