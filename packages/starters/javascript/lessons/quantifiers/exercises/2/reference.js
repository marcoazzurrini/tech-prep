export function isPin(text) {
  return /^\d{4,6}$/.test(text);
}
