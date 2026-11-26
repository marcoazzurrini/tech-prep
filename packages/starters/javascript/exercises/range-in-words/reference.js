export function describeRange(a, b) {
  const from = Math.min(a, b);
  const to = Math.max(a, b);
  const gap = to - from;
  const unit = gap === 1 ? "step" : "steps";

  return `${from} to ${to}: ${gap} ${unit}`;
}
