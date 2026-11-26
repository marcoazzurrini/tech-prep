export function totalWidth(widths) {
  let total = 0;

  for (const width of widths) {
    const pixels = parseFloat(width);

    if (!Number.isNaN(pixels)) {
      total += pixels;
    }
  }

  return total;
}
