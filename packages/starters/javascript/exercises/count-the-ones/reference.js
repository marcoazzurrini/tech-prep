export function countOnes(n) {
  let rest = n;
  let count = 0;

  while (rest !== 0) {
    count += rest & 1;
    rest >>>= 1;
  }

  return count;
}
