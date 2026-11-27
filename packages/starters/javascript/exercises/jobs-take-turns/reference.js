export function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function takeTurns() {
  let last = new Promise((resolve) => resolve());

  return (job) => {
    const result = last.then(() => job());
    last = result;
    return result;
  };
}
