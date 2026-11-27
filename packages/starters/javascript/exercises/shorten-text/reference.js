export function shorten(text, max) {
  const chars = [...text];

  if (chars.length <= max) {
    return text;
  }

  return chars.slice(0, max).join("") + "…";
}
