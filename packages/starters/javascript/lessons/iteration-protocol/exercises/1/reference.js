export function collect(iterable) {
  const iterator = iterable[Symbol.iterator]();
  const values = [];
  let result = iterator.next();

  while (!result.done) {
    values.push(result.value);
    result = iterator.next();
  }

  return values;
}
