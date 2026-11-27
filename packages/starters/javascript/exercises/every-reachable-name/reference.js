export function reachableNames(obj) {
  const names = [];
  let current = obj;

  while (current !== null && current !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(current)) {
      if (!names.includes(name)) {
        names.push(name);
      }
    }

    current = Object.getPrototypeOf(current);
  }

  return names;
}
