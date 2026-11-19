export function cheapestFrogPath(heights: number[]): number {
  // cost[i] = lowest cost to reach stone i.
  const cost = new Array<number>(heights.length).fill(0);
  for (let i = 1; i < heights.length; i++) {
    cost[i] = cost[i - 1] + Math.abs(heights[i] - heights[i - 1]);
    if (i >= 2) {
      // The last jump may also come from two stones back.
      cost[i] = Math.min(
        cost[i],
        cost[i - 2] + Math.abs(heights[i] - heights[i - 2])
      );
    }
  }
  return cost[cost.length - 1];
}
