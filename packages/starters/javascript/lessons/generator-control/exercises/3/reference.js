export function* tally() {
  let count = 0;

  while (true) {
    try {
      yield count;
      count++;
    } catch {
      count = 0;
    }
  }
}
