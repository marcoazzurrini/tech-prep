# Graph Representation

A graph is often given as a list of edges. That list is slow to search. First build an **adjacency list**: for each node, the list of its neighbours. Then "who is next to this node?" takes one lookup.

## Worked example

Bus lines join pairs of stops. Build the list of stops you can reach from each stop.

```ts
const lines = [
  ["park", "school"],
  ["park", "shop"],
  ["shop", "station"],
];
const neighbours = new Map<string, string[]>();

const add = (from: string, to: string) => {
  const list = neighbours.get(from) ?? [];
  list.push(to);
  neighbours.set(from, list);
};

for (const [a, b] of lines) {
  add(a, b);
  add(b, a);
}

// neighbours.get("park") is ["school", "shop"]
```

## Why it works

- One pass over the edges fills every list.
- Each line is added twice, because a bus runs both ways. For a one-way edge, add it once.
- When the nodes are numbered `0` to `n - 1`, use an array of lists in place of the map.

## When to use it

- The input is a list of pairs, such as `[a, b]` for "a is joined to b".
- The task is about friends, roads, links, or things that depend on other things.
- You need the neighbours of a node, or how many edges touch it.
