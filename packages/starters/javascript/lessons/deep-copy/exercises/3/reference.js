export function cloneWidget(widget) {
  const copy = {};

  for (const [key, value] of Object.entries(widget)) {
    copy[key] = typeof value === "function" ? value : structuredClone(value);
  }

  return copy;
}
