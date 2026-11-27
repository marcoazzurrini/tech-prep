export function numberAt(text, position) {
  const digits = /\d+/y;
  digits.lastIndex = position;

  const match = digits.exec(text);
  return match === null ? null : Number(match[0]);
}
