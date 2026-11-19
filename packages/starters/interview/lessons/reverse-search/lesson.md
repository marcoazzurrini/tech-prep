# Searching from the Targets

Some tasks ask "which nodes can reach a target?". A search forward from every node repeats a lot of work. Turn the question round: start at the target and walk the edges backwards. Every node you visit can reach the target.

## Worked example

A website has one-way links. Find every page that can lead to the `pay` page.

```ts
const links = [
  ["home", "shop"],
  ["shop", "pay"],
  ["help", "home"],
  ["pay", "bye"],
];
const cameFrom = new Map<string, string[]>();
for (const [from, to] of links) {
  cameFrom.set(to, [...(cameFrom.get(to) ?? []), from]);
}

const seen = new Set(["pay"]);
const stack = ["pay"];
while (stack.length > 0) {
  for (const page of cameFrom.get(stack.pop()!) ?? []) {
    if (seen.has(page)) continue;
    seen.add(page);
    stack.push(page);
  }
}
// seen: pay, shop, home, help. Not bye.
```

## Why it works

- One search from the target replaces one search from every page.
- `cameFrom` stores the links reversed. So a step goes from a page to the pages that link to it.
- At the end, `seen` is the answer: every page with a path to the target.

## When to use it

- The task asks which cells or nodes can reach a target, an edge or a border.
- There are many possible starts and only a few targets.
- The rule for a step can be turned round: "a links to b" becomes "b came from a".
