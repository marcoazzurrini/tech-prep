export function isWholeCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}
