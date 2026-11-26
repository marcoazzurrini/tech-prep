export function askOnce(fn, key) {
  fn.answers ??= {};

  if (fn.answers[key] === undefined) {
    fn.answers[key] = fn(key);
  }

  return fn.answers[key];
}
