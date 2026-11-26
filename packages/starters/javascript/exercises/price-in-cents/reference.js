export function toCents(text) {
  if (text.trim() === "") {
    return null;
  }

  const price = Number(text);

  if (!Number.isFinite(price) || price < 0) {
    return null;
  }

  return Math.round(price * 100);
}
