export function findLongWords(text, min) {
  return text.match(new RegExp(`[a-z]{${min},}`, "gi")) ?? [];
}
