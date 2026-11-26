export function readAmount(text) {
  if (text.trim() === "") {
    return null;
  }

  const amount = Number(text);

  return Number.isNaN(amount) ? null : amount;
}
