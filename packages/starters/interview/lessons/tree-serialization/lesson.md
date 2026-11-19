# Tree Serialization

To save a tree as text, write its values in traversal order. Values alone are not enough: two trees with different shapes can give the same values. So also write a mark for every missing child. Then the text fits one shape only, and the tree can be rebuilt.

## Worked example

Write two trees in preorder, with `#` for a missing child.

```ts
function write(node: TreeNode | null): string {
  if (node === null) return "#";
  return `${node.val} ${write(node.left)} ${write(node.right)}`;
}

const a = new TreeNode(1, new TreeNode(2), null); // 2 is the left child
const b = new TreeNode(1, null, new TreeNode(2)); // 2 is the right child

write(a); // "1 2 # # #"
write(b); // "1 # 2 # #"
// Without the marks, both would be "1 2".
```

## Why it works

- Preorder writes the root first. A reader can create a node before it reads the node's children.
- Each `#` says "this subtree is empty". So the reader always knows where the left subtree ends and the right one starts.
- The reader takes one token at a time. `#` gives `null`. Any other token gives a node; then read its left subtree, then its right subtree.

## When to use it

- The task says "serialize", "encode", "save" or "send" a tree, and later rebuild it.
- You want to compare trees by text, or use a tree as a map key. Equal text means equal trees.
- The shape cannot be worked out from the values alone.
