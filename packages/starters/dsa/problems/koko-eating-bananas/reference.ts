export function minEatingSpeed(piles: number[], h: number): number {
  const hoursNeeded = (k: number): number => {
    // A pile of p bananas takes ceil(p / k) hours.
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    return hours;
  };

  // Search the speeds 1..max(piles). The largest one always works.
  let lo = 1;
  let hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursNeeded(mid) <= h) {
      hi = mid; // fast enough: keep it and try slower
    } else {
      lo = mid + 1; // too slow: the answer is faster
    }
  }
  return lo;
}
