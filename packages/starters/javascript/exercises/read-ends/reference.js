export function readEnds(items, offset = 1) {
  const fromStart = items.at(offset - 1);
  const fromEnd = items.at(-offset);
  return {
    fromStart: fromStart === undefined ? null : fromStart,
    fromEnd: fromEnd === undefined ? null : fromEnd,
  };
}
