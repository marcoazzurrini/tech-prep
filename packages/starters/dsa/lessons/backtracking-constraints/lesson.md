# Pruning with Constraints

Some answers must follow a rule. Do not build every candidate and test it at the end. Check the rule before each choice. Leave a branch as soon as it cannot lead to a valid answer.

## Worked example

List every string of three letters, `a` or `b`, with no two `b` in a row.

```ts
const results: string[] = [];

function build(text: string): void {
  if (text.length === 3) {
    results.push(text); // every full string is valid
    return;
  }
  build(text + "a"); // "a" is always allowed
  if (!text.endsWith("b")) {
    build(text + "b"); // allowed only after "a" or at the start
  }
}
build("");
// results: aaa, aab, aba, baa, bab
```

## Why it works

- The `if` runs before the choice. A string with `bb` is never built.
- One skipped choice removes a whole branch. All strings that start with `bb` are gone after one check.
- Each partial string follows the rule. So the base case needs no test.

## When to use it

- The task asks for all "valid" answers, and gives rules for what is valid.
- You can tell from a partial answer that a rule is already broken.
- Trying every candidate is too slow, but most candidates break a rule early.
