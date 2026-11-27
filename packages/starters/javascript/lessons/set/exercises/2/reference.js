export function distinctSizes(boxes) {
  const sizes = new Set();

  for (const { w, h } of boxes) {
    const small = Math.min(w, h);
    const large = Math.max(w, h);
    sizes.add(`${small}x${large}`);
  }

  return sizes.size;
}
