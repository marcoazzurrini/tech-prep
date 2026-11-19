export function longestRunWithinBudget(
  costs: number[],
  budget: number
): number {
  let left = 0;
  let total = 0; // cost of the window
  let best = 0;
  for (let right = 0; right < costs.length; right++) {
    total += costs[right]; // grow on the right
    while (total > budget) {
      total -= costs[left]; // shrink on the left until the window fits
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
