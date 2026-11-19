export function worstStretch(changes: number[]): number {
  let current = changes[0];
  let worst = changes[0];
  for (let i = 1; i < changes.length; i++) {
    // Extend the stretch that ends here, or restart at this day.
    current = Math.min(changes[i], current + changes[i]);
    worst = Math.min(worst, current);
  }
  return worst;
}
