export function evalMinMax(tokens: string[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token === "neg") {
      // One value in, one value out.
      stack.push(-stack.pop()!);
    } else if (token === "max") {
      stack.push(Math.max(stack.pop()!, stack.pop()!));
    } else if (token === "min") {
      stack.push(Math.min(stack.pop()!, stack.pop()!));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0]!;
}
