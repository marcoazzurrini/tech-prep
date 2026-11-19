# Evaluate Reverse Polish Notation (medium)

The array `tokens` holds an arithmetic expression in Reverse Polish Notation. In this notation an operator comes after its two operands. Return the value of the expression.
- Each token is an integer or one of the operators `+`, `-`, `*`, `/`.
- An operator uses the two values before it. The first of the two is the left operand.
- Division drops the fraction. It rounds toward zero, so `-7 / 2` is `-3`.

Example 1: tokens = ["2", "1", "+", "3", "*"]  ->  9
  This is (2 + 1) * 3.
Example 2: tokens = ["4", "13", "5", "/", "+"]  ->  6
  This is 4 + (13 / 5).

Constraints: 1 <= len(tokens) <= 10^4. The expression is always valid, and it never divides by zero.
