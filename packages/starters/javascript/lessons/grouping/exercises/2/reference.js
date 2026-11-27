export function countWords(words) {
  return words.reduce((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, Object.create(null));
}
