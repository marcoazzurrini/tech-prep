export function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      // The first pop is the right operand.
      const right = stack.pop()!;
      const left = stack.pop()!;
      if (token === "+") stack.push(left + right);
      else if (token === "-") stack.push(left - right);
      else if (token === "*") stack.push(left * right);
      // Math.trunc rounds toward zero.
      else stack.push(Math.trunc(left / right));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0]!;
}
