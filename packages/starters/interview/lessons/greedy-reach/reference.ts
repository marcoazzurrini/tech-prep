export function highestClimb(ladders: number[][]): number {
  let reach = 0; // highest height reached so far
  for (const [bottom, top] of ladders) {
    // This ladder starts above the reach. So do all later ones.
    if (bottom > reach) break;
    reach = Math.max(reach, top);
  }
  return reach;
}
