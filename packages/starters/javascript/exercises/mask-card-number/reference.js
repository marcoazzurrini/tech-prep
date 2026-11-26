export function maskCard(number) {
  const hidden = Math.max(0, number.length - 4);

  return "*".repeat(hidden) + number.slice(hidden);
}
