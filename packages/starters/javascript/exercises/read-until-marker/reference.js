export function readUntil(iterator, marker) {
  const before = [];
  let result = iterator.next();

  while (!result.done && result.value !== marker) {
    before.push(result.value);
    result = iterator.next();
  }

  return before;
}
