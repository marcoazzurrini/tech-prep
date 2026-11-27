export function stripPunctuation(text) {
  return text.replace(/[^a-z0-9 ]/gi, "");
}
