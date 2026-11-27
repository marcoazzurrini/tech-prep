const card = /\b\d(?:[ -]?\d){11,18}\b/g;

export function maskCards(text) {
  return text.replace(card, (number) => number.replace(/\d(?=(?:\D?\d){4})/g, "*"));
}
