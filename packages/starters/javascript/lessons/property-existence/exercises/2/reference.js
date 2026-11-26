export function knownWords(dictionary, words) {
  return words.filter((word) => Object.hasOwn(dictionary, word));
}
