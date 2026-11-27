export function containsText(text, part) {
  return text.normalize().includes(part.normalize());
}
