# Using Every Edge Once

Some tasks ask for one route that uses every edge exactly once. Follow edges depth-first and delete each edge as you use it. Add a node to the route only when it has no edges left. The route comes out reversed.

## Worked example

Draw every line of a figure once without lifting the pen. Each line goes one way. Start at dot A.

```ts
const lines = new Map([
  ["A", ["B"]],
  ["B", ["C", "D"]],
  ["C", ["B"]],
  ["D", []],
]);
const route: string[] = [];

function draw(dot: string): void {
  const out = lines.get(dot) ?? [];
  while (out.length > 0) {
    draw(out.pop()!); // pop deletes the line as it is used
  }
  route.push(dot); // no lines left at this dot
}

draw("A");
route.reverse();
// route: A, B, C, B, D
```

## Why it works

- From B the code tries D first. D is a dead end, so D is added first. After the reverse, D is last. A dead end can only be the end of the route.
- The `while` loop then goes back to B and takes the line it skipped. So a wrong first choice never needs to be undone.
- Each line is popped once. The work is one step per edge.

## When to use it

- The task says to use every ticket, road, line or pair **exactly once**, in one route.
- The items to use up are the edges. Nodes may be visited many times.
- Plain backtracking over all orders works but is far too slow.
