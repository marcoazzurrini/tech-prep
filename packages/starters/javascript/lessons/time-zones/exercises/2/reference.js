export function parseServerTime(text) {
  return Date.parse(`${text.replace(" ", "T")}Z`);
}
