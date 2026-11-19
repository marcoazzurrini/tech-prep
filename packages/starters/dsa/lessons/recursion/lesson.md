# Recursion

A recursive function calls itself on a smaller input. Write the base case first: the smallest input, where you know the answer without another call. For every other input, trust the call on the smaller input, and build your answer from its result.

## Worked example

Compute the factorial of `n`. That is the product `n * (n - 1) * ... * 1`.

```ts
function factorial(n: number): number {
  // Base case: the smallest input has a known answer.
  if (n <= 1) return 1;

  // Trust the call on the smaller input.
  return n * factorial(n - 1);
}

factorial(4); // 4 * 3 * 2 * 1 = 24
```

## Why it works

- The base case stops the calls. Without it, the function calls itself forever.
- Each call gets a smaller input, so the calls must reach the base case.
- You do not need to trace every call. Check one step: if `factorial(n - 1)` is right, then `n * factorial(n - 1)` is right.

## When to use it

- The answer for an input is defined by the answer for a smaller input.
- The data is nested: a tree, a list inside a list, a folder inside a folder.
- You can name the smallest case and its answer in one sentence.
