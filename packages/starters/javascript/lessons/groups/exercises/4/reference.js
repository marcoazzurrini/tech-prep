export function hasDoubledWord(text) {
  return /\b(\w+)\s+\1\b/i.test(text);
}
