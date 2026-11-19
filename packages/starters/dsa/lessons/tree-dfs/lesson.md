# Tree Depth-First Search

A tree is recursive: each child is the root of a smaller tree. So ask the same function about the left child and the right child. Then combine the two answers into the answer for the node. Information can also go the other way: pass it down as an argument.

## Worked example

Count the nodes of a tree.

```ts
function countNodes(node: TreeNode | null): number {
  // Base case: an empty tree has no nodes.
  if (node === null) return 0;

  const left = countNodes(node.left);
  const right = countNodes(node.right);

  // This node, plus everything below it.
  return 1 + left + right;
}

// For the tree 1 -> (2, 3): countNodes(root) is 3
```

## Why it works

- `null` is the base case. Handle it once at the top, and you never need to check for a missing child.
- The two calls return the answers for the two subtrees. Trust them, as in any recursion.
- The last line builds the node's answer from its children's answers. Each node is visited once, so the time is O(n).

## When to use it

- The answer for a tree comes from the answers for its left and right subtrees: depth, size, sum, "are these two trees equal".
- You must visit every node, and the order between levels does not matter.
- A node needs something from the nodes above it. Pass that as an extra argument.
