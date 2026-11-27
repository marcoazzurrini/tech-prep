export function titleToSlug(title) {
  const words = title.match(/[\p{L}\p{N}]+/gu) ?? [];
  return words.join("-").toLowerCase();
}
