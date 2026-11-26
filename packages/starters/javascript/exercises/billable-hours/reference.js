export function billableHours(stays, minimum) {
  const atLeast = (hours) => Math.max(hours, minimum);
  const billed = [];

  for (const stay of stays) {
    billed.push(atLeast(Math.ceil(stay)));
  }

  return billed;
}
