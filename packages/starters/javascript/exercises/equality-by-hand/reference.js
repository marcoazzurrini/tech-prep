const isEmpty = (value) => value === null || value === undefined;

export function looseEquals(a, b) {
  if (isEmpty(a) || isEmpty(b)) {
    return isEmpty(a) && isEmpty(b);
  }

  if (typeof a === typeof b) {
    return a === b;
  }

  // A boolean becomes a number, and so does a string beside a number.
  return Number(a) === Number(b);
}
