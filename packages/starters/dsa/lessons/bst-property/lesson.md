# Binary Search Tree Property

In a binary search tree, every value in a node's left subtree is smaller than the node. Every value in its right subtree is larger. This holds at every node. So one comparison tells you which side to search. And an in-order walk (left, node, right) visits the values in sorted order.

## Worked example

Check if a binary search tree contains a value.

```ts
function contains(root: TreeNode | null, target: number): boolean {
  let node = root;
  while (node !== null) {
    if (target === node.val) return true;
    // Steer: smaller values are on the left, larger on the right.
    node = target < node.val ? node.left : node.right;
  }
  return false;
}

// In the tree 5 -> (3, 8): contains(root, 8) is true, contains(root, 4) is false
```

## Why it works

- Each comparison rules out a whole subtree, as binary search rules out half of an array.
- You follow one path down from the root. The cost is the height of the tree, not its size.
- The rule covers whole subtrees, not only the two children. A value deep in the left subtree must still be smaller than the root.

## When to use it

- The statement says "binary search tree" or "BST". Use the order. Do not search both sides.
- You look for a value, or for the value nearest to a target: steer by comparison.
- You need the values in sorted order, or the k-th smallest value: walk in-order.
