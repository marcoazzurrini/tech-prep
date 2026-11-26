export function replaceAt(text, index, char) {
  return text.slice(0, index) + char + text.slice(index + 1);
}
