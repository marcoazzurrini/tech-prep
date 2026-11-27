export function formatAmount(amount, digits) {
  const rounded = Math.round(Number(`${amount}e${digits}`)) / 10 ** digits;
  return rounded.toFixed(digits);
}
