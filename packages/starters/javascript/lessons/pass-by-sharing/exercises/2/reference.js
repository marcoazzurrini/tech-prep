export function capScores(scores, max) {
  for (const [index, score] of scores.entries()) {
    scores[index] = Math.min(score, max);
  }
}
