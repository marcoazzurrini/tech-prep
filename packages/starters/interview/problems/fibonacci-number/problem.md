# Fibonacci Number (easy)

The Fibonacci numbers start with `fib(0) = 0` and `fib(1) = 1`. Every later number is the sum of the two numbers before it: `fib(n) = fib(n - 1) + fib(n - 2)`.

Given `n`, return `fib(n)`.

Example 1: n = 2  ->  1  (0 + 1)
Example 2: n = 3  ->  2  (1 + 1)
Example 3: n = 4  ->  3  (1 + 2)

Constraints: 0 <= n <= 30.
Follow-up: plain recursion computes the same values many times. Can you store each value the first time?
