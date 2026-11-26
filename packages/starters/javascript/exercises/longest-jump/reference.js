export function longestJump(jumps) {
  let best = Number(jumps[0]);

  for (const jump of jumps) {
    const length = Number(jump);

    if (length > best) {
      best = length;
    }
  }

  return best;
}
