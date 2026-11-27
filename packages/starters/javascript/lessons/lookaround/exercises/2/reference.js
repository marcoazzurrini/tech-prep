export function readHashtags(text) {
  return text.match(/(?<=#)\w+/g) ?? [];
}
