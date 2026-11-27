export function hasCycle(value, onPath = new WeakSet()) {
  if (value === null || typeof value !== "object") {
    return false;
  }

  if (onPath.has(value)) {
    return true;
  }

  onPath.add(value);

  for (const child of Object.values(value)) {
    if (hasCycle(child, onPath)) {
      return true;
    }
  }

  onPath.delete(value);
  return false;
}
