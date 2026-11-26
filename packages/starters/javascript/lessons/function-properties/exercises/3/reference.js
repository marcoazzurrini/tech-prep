export function recordUse(fn) {
  fn.uses = (fn.uses ?? 0) + 1;

  return fn.uses;
}
