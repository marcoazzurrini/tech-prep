# Carrying State Down the Tree

Some questions about a node depend on the nodes above it. A node cannot look up. So the parent passes down what the path has seen so far, as an argument. Each call updates that value before it passes it to its own children.

## Worked example

Multiply each value by its depth, and add up the results. The root has depth 1.

```ts
function weightedSum(node: TreeNode | null, depth = 1): number {
  if (node === null) return 0;

  // `depth` came from the parent. Use it here.
  const here = node.val * depth;

  // Pass the updated state down to both children.
  const left = weightedSum(node.left, depth + 1);
  const right = weightedSum(node.right, depth + 1);
  return here + left + right;
}

// For the tree 1 -> (2, 3): 1 * 1 + 2 * 2 + 3 * 2 = 11
```

## Why it works

- The argument holds all that a node needs from its ancestors. No parent pointers are needed.
- `depth + 1` makes a new value. It does not change the parent's `depth`, so the left subtree cannot disturb the right subtree.
- The state can be any small value: a depth, a running sum, the largest value so far.

## When to use it

- A node is judged against its ancestors: "on the path from the root", "no node above it is larger".
- The answer depends on the depth, or on a running total from the root.
- You can name the one value a child needs from above.
