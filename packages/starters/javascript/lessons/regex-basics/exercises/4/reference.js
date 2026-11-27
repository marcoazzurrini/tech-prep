export function containsTerm(text, term) {
  return new RegExp(RegExp.escape(term), "i").test(text);
}
