export function initials(name) {
  const words = name.match(/\p{L}+/gu) ?? [];
  return words.map((word) => word[0].toUpperCase()).join("");
}
