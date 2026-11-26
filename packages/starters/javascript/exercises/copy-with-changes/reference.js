export function copyWith(changes) {
  return { ...this, ...changes };
}
