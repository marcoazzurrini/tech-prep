export function mentions(text, name) {
  return text.includes("@" + name);
}
