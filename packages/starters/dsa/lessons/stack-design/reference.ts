export function sortedAfterEachOp(ops: number[]): boolean[] {
  const result: boolean[] = [];
  const stack: [number, boolean][] = []; // [value, is the stack in order from here down?]
  for (const op of ops) {
    if (op === 0) {
      stack.pop();
    } else {
      // In order here: in order below, and not smaller than the value below.
      const below = stack[stack.length - 1];
      stack.push([op, below === undefined || (below[1] && op >= below[0])]);
    }
    const top = stack[stack.length - 1];
    result.push(top === undefined || top[1]);
  }
  return result;
}
