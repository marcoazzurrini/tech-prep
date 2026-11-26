export function firstLong(words) {
  for (const word of words) {
    if (word.length > 5) {
      return word;
    }
  }

  return "none";
}
