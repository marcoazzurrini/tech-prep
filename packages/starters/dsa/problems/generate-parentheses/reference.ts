export function generateParenthesis(n: number): string[] {
  const result: string[] = [];
  const current: string[] = [];

  const build = (opened: number, closed: number): void => {
    if (current.length === 2 * n) {
      result.push(current.join(""));
      return;
    }
    // Rule 1: open a bracket while some are left.
    if (opened < n) {
      current.push("(");
      build(opened + 1, closed);
      current.pop();
    }
    // Rule 2: close only a bracket that is open.
    if (closed < opened) {
      current.push(")");
      build(opened, closed + 1);
      current.pop();
    }
  };

  build(0, 0);
  return result;
}
