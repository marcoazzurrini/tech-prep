export function makeWordFilter(words) {
  const source = `\\b(?:${words.join("|")})\\b`;
  const anyWord = new RegExp(source, "i");
  const everyWord = new RegExp(source, "gi");

  return {
    isBlocked: (text) => anyWord.test(text),
    censor: (text) => text.replace(everyWord, (word) => "*".repeat(word.length)),
  };
}
