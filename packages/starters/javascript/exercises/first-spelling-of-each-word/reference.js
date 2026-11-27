export function distinctWords(text) {
  const seen = new Set();
  const result = [];

  for (const word of text.split(" ")) {
    const key = word.toLowerCase();

    if (word !== "" && !seen.has(key)) {
      seen.add(key);
      result.push(word);
    }
  }

  return result;
}
