export function runSteps(value, steps) {
  let current = value;

  for (const step of steps) {
    current = step(current);
  }

  return current;
}
