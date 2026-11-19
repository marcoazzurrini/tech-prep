export function isNStraightHand(hand: number[], groupSize: number): boolean {
  if (hand.length % groupSize !== 0) return false;
  const count = new Map<number, number>();
  for (const card of hand) count.set(card, (count.get(card) ?? 0) + 1);

  // The smallest card left must start a group. Go through values in order.
  const values = [...count.keys()].sort((a, b) => a - b);
  for (const card of values) {
    const starts = count.get(card) ?? 0;
    if (starts === 0) continue;
    // Every group that starts here needs the next groupSize values.
    for (let value = card; value < card + groupSize; value++) {
      const have = count.get(value) ?? 0;
      if (have < starts) return false;
      count.set(value, have - starts);
    }
  }
  return true;
}
