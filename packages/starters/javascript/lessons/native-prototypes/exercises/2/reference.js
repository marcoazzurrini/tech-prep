export function chainLength(value) {
  let count = 0;
  let proto = Object.getPrototypeOf(value);

  while (proto !== null) {
    count += 1;
    proto = Object.getPrototypeOf(proto);
  }

  return count;
}
