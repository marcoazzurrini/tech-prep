export function hexToRgb(colour) {
  return [1, 3, 5].map((start) => parseInt(colour.slice(start, start + 2), 16));
}
