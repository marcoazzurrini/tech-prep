# Path Values through a Node

A path in a tree may go up to a node and down its other side. That path uses both children of its top node. But a parent can extend a path through one child only. So the recursive function does two jobs. It updates a global best with the two-sided path. It returns the best one-sided path.

## Worked example

Every node holds a positive weight. Find the heaviest path: the largest sum of weights along any path.

```ts
function heaviestPath(root: TreeNode | null): number {
  let best = 0;
  function arm(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = arm(node.left);
    const right = arm(node.right);
    // Two-sided: the path that bends at this node.
    best = Math.max(best, left + node.val + right);
    // One-sided: what the parent can extend.
    return node.val + Math.max(left, right);
  }
  arm(root);
  return best;
}
// For the tree 1 -> (2, 3): the path 2, 1, 3 weighs 6
```

## Why it works

- A path may use both sides of a node, so the global answer adds `left` and `right`.
- The parent can continue on one side only. Returning both sides would give a fork, not a path.
- The best path may never touch the root. So `best` is updated at every node.

## When to use it

- The task asks for the longest or largest path between any two nodes.
- The statement says the path "does not need to pass through the root".
- What a node gives to its parent differs from what it adds to the answer.
