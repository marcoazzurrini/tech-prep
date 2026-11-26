export function nestedSum(list) {
  let sum = 0;

  for (const item of list) {
    sum += Array.isArray(item) ? nestedSum(item) : item;
  }

  return sum;
}
