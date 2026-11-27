export function longestWord(words) {
  return words.reduce((best, word) => (word.length > best.length ? word : best), "");
}
