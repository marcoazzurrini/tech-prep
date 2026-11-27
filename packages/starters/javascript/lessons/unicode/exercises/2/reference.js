export function codePointLabels(text) {
  const labels = [];

  for (const char of text) {
    const hex = char.codePointAt(0).toString(16).toUpperCase();
    labels.push("U+" + hex.padStart(4, "0"));
  }

  return labels;
}
