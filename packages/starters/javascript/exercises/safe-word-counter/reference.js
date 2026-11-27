export function countWords(words) {
  const counts = Object.create(null);
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}
