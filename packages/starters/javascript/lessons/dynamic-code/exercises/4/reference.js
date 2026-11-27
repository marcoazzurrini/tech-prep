const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

export function calculate(a, op, b) {
  return Object.hasOwn(operations, op) ? operations[op](a, b) : null;
}
