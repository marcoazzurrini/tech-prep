export function maskCard(number) {
  return number.slice(-4).padStart(number.length, "*");
}
