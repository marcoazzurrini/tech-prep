# Relaxing Edges in Rounds

To relax an edge means: check if going through it gives a better value for the node at its end. Relax every edge once per round. Read from the previous round's values. Then after k rounds, the values allow paths of at most k edges.

## Worked example

Each move goes from one room to another and gives coins. Start in room 0. Find the most coins you can hold in each room after at most 2 moves.

```ts
const moves = [
  [0, 1, 5],
  [1, 2, 4],
  [0, 2, 6],
  [2, 3, 3],
]; // [from, to, coins]
const best = [0, -Infinity, -Infinity, -Infinity];

for (let round = 0; round < 2; round++) {
  const prev = [...best]; // the values before this round
  for (const [from, to, coins] of moves) {
    best[to] = Math.max(best[to], prev[from] + coins);
  }
}

// best: [0, 5, 9, 9]
```

## Why it works

- A path with k moves is a path with k - 1 moves plus one more move. So each round adds one move to every path.
- `prev` is a copy. Without it, a value changed early in a round would be used again in the same round. That chains two moves in one round.
- `-Infinity` marks a room you cannot reach yet.

## When to use it

- The task limits the number of edges, steps or stops on a path.
- Edge weights can be negative, so Dijkstra is not safe.
- The input is a plain list of edges. You do not need to build a graph first.
