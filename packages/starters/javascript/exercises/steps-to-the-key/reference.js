export function stepsToKey(obj, key) {
  let steps = 0;

  for (let current = obj; current !== null; current = Object.getPrototypeOf(current)) {
    if (Object.hasOwn(current, key)) {
      return steps;
    }

    steps += 1;
  }

  return -1;
}
