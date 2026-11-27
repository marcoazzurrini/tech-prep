export function yearsToReach(start, goal, ratePercent) {
  if (start >= goal) {
    return 0;
  }

  const growth = 1 + ratePercent / 100;

  return Math.ceil(Math.log(goal / start) / Math.log(growth));
}
