export function whereIsItDefined(obj, key) {
  let current = obj;

  while (current !== null) {
    if (Object.hasOwn(current, key)) {
      return current;
    }

    current = Object.getPrototypeOf(current);
  }

  return null;
}
