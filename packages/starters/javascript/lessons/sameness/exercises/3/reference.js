const sameValueZero = (a, b) => a === b || (Number.isNaN(a) && Number.isNaN(b));

export function countMatches(list, target) {
  let count = 0;

  for (const item of list) {
    if (sameValueZero(item, target)) {
      count += 1;
    }
  }

  return count;
}
