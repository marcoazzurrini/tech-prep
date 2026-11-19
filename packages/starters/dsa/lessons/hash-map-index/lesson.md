# Value-to-Index Map

Store each value in a map, together with the index where you saw it. Later, one lookup tells you if a matching value came earlier, and where. This finds pairs in one pass.

## Worked example

Pair up socks. Each sock looks for an earlier sock of the same colour.

```ts
const socks = ["red", "blue", "red", "grey", "blue"];
const waiting = new Map<string, number>(); // colour -> index
const pairs: number[][] = [];

for (let i = 0; i < socks.length; i++) {
  const j = waiting.get(socks[i]);
  if (j !== undefined) {
    pairs.push([j, i]);
    waiting.delete(socks[i]);
  } else {
    waiting.set(socks[i], i);
  }
}

// pairs: [0, 2] and [1, 4]. Sock 3 has no partner.
```

## Why it works

- The map holds earlier socks only. So a sock never pairs with itself.
- `waiting.get` returns an index, not just yes or no. A set cannot do that.
- The check is `j !== undefined`. Index 0 is a real index, but `if (j)` would treat it as false.

## When to use it

- The answer is made of positions, not of values.
- Each item needs a partner that you can work out from the item itself. The partner may be the same value, or the value that completes a sum.
- Checking every pair with two loops is too slow, and you want one pass.
