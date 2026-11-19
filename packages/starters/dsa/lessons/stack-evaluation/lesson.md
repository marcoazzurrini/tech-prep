# Evaluating with a Stack

Some expressions put the operator after its values. Read the tokens from left to right. Push each value. When an operator arrives, pop the values it needs, compute, and push the result back. The result is a value like any other, so a later operator can use it.

## Worked example

The operator `join` glues the two words before it into one word.

```ts
const tokens = ["sun", "flower", "join", "s", "join"];
const stack: string[] = [];

for (const token of tokens) {
  if (token === "join") {
    const right = stack.pop()!;
    const left = stack.pop()!;
    stack.push(left + right);
  } else {
    stack.push(token);
  }
}

// stack: ["sunflowers"]
```

## Why it works

- The values an operator needs are the newest ones. They are on top of the stack.
- The first pop gives the **right** value, because it was pushed last. Swap them and you get `"flowersun"`.
- Pushing the result back lets the second `join` use `"sunflower"` as its left value.
- A valid expression leaves exactly one value on the stack: the answer.

## When to use it

- The operator comes after its operands. This is called postfix, or Reverse Polish Notation.
- A result of one step is the input of a later step.
- The task describes a small machine with commands that take and return values.
