export function* chainAll(...sources) {
  for (const source of sources) {
    yield* source;
  }
}
