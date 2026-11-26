export function deepestPoint(events) {
  let depth = 0;
  let deepest = 0;

  for (const event of events) {
    depth += event === "return" ? -1 : 1;
    deepest = Math.max(deepest, depth);
  }

  return deepest;
}
