export function* averager() {
  let sum = 0;
  let count = 0;
  let average = null;

  while (true) {
    const number = yield average;
    sum += number;
    count++;
    average = sum / count;
  }
}
