export function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function applyInOrder(start, steps) {
  let result = new Promise((resolve) => resolve(start));

  for (const step of steps) {
    result = result.then(step);
  }

  return result;
}
