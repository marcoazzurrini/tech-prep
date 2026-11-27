export function reduce(list, reducer, ...start) {
  let index = 0;
  let total;

  if (start.length > 0) {
    total = start[0];
  } else if (list.length > 0) {
    total = list[0];
    index = 1;
  } else {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  for (; index < list.length; index++) {
    total = reducer(total, list[index], index, list);
  }
  return total;
}
