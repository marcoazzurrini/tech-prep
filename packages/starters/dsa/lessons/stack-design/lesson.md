# Stack with Extra State

Sometimes you need a fact about the whole stack, such as its smallest value. Do not search the stack for it. Store the fact beside each entry: it describes that entry and everything below it. After a pop, the new top entry already holds the right fact.

## Worked example

A stack of words that always knows its longest word.

```ts
// Each entry: [word, longest word from this entry down]
const stack: [string, string][] = [];

function push(word: string) {
  const longest = stack.length > 0 ? stack[stack.length - 1][1] : "";
  stack.push([word, word.length > longest.length ? word : longest]);
}

push("to");
push("banana");
push("fig");
// top entry: ["fig", "banana"]

stack.pop();
stack.pop();
// top entry: ["to", "to"]
```

## Why it works

- A push only needs the fact of the entry below and the new value. That is O(1).
- Each entry keeps its own copy of the fact. A pop removes the entry and its fact together.
- One shared variable would fail. After `"banana"` is popped, you could not tell what the longest word was before it.

## When to use it

- The task asks for a stack with one more operation, such as "smallest value", in O(1) time.
- The fact cannot be undone from the popped value alone. Smallest, largest and longest are like this.
