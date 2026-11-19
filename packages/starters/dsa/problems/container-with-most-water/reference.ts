export function maxArea(height: number[]): number {
  let i = 0;
  let j = height.length - 1;
  let best = 0;
  while (i < j) {
    best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
    // The shorter wall limits the area, so move it inward.
    if (height[i] < height[j]) i++;
    else j--;
  }
  return best;
}
