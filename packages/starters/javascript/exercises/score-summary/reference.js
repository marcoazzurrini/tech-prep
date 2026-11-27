export function summarize(scores) {
  if (scores.length === 0) {
    return { lowest: null, highest: null, average: null };
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = Math.round(Number(`${total / scores.length}e1`)) / 10;

  return { lowest: Math.min(...scores), highest: Math.max(...scores), average };
}
