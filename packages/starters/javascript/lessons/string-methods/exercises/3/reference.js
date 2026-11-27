export function wordCount(text) {
  return text
    .trim()
    .split(" ")
    .filter((word) => word !== "").length;
}
