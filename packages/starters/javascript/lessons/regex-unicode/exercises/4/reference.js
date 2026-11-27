export function foreignLetters(text) {
  return (text.match(/[\p{L}--[a-zA-Z]]/gv) ?? []).join("");
}
