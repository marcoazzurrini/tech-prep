export function lastTwo(stack) {
  let top = stack.length;

  const first = stack[--top];
  const second = stack[--top];

  return [first, second];
}
