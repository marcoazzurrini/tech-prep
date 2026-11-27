export function chainLength(obj) {
  let length = 0;
  let proto = Object.getPrototypeOf(obj);

  while (proto !== null) {
    length += 1;
    proto = Object.getPrototypeOf(proto);
  }

  return length;
}
