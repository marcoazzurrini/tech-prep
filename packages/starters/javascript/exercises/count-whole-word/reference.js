export function countWholeWord(text, word) {
  const pattern = new RegExp(`\\b${word}\\b`, "gi");
  return (text.match(pattern) ?? []).length;
}
