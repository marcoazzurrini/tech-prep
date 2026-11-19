# Graph DFS and BFS

To visit a graph, start at one node and keep moving to neighbours. A graph can lead back to where you were, so keep a `visited` set and enter each node once. One traversal covers one connected group. To cover the whole graph, start a new traversal at every node that is still unvisited.

## Worked example

Find everyone in the friend group of person 0.

```ts
// friends[p] lists the friends of person p.
const friends = [[1, 2], [0], [0, 3], [2], []];

const visited = new Set([0]);
const stack = [0];
while (stack.length > 0) {
  const person = stack.pop()!;
  for (const friend of friends[person]) {
    if (visited.has(friend)) continue;
    visited.add(friend);
    stack.push(friend);
  }
}

// visited: 0, 1, 2, 3. Person 4 is in another group.
```

## Why it works

- `visited` stops the search from going round in circles. Mark a node when you push it, so it is never pushed twice.
- A stack gives DFS. A queue gives BFS. Both visit the same nodes.
- When the stack is empty, `visited` holds one whole group.

## When to use it

- The task asks what can be reached from a node, or whether two nodes are connected.
- The task asks to count or measure groups: "components", "islands", "provinces". Loop over all nodes and start a traversal at each unvisited one.
- A grid is a graph too. Cells are nodes, and cells that touch are neighbours.
