export function fillBlanks(text, ...values) {
  let filled = text;

  for (const [index, value] of values.entries()) {
    // split and join, because `replaceAll` gives `$` a meaning in the replacement.
    filled = filled.split(`{${index}}`).join(String(value));
  }

  return filled;
}
