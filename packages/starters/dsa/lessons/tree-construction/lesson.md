# Building Trees from Traversals

Preorder visits the root, then the left subtree, then the right subtree. So the first preorder value is the root. Inorder visits left, root, right. So the root's position in inorder shows which values are in the left subtree and which are in the right. Then do the same for each subtree.

## Worked example

Do one split by hand: find the root, then the traversals of its two subtrees.

```ts
const preorder = [3, 9, 20, 15, 7];
const inorder = [9, 3, 15, 20, 7];

const root = preorder[0]; // 3
const mid = inorder.indexOf(root); // 1

const leftInorder = inorder.slice(0, mid); // [9]
const rightInorder = inorder.slice(mid + 1); // [15, 20, 7]
const leftPreorder = preorder.slice(1, 1 + mid); // [9]
const rightPreorder = preorder.slice(1 + mid); // [20, 15, 7]

// Left subtree: only 9. Right subtree: root 20, with 15 and 7 below it.
```

## Why it works

- `mid` is also the size of the left subtree. Preorder lists the whole left subtree straight after the root, so the next `mid` values belong to it.
- Each pair of slices is the preorder and inorder of a smaller tree. That is a recursive call.
- `indexOf` scans the array each time. A map from value to inorder index, built once, finds the root in O(1).

## When to use it

- The input is two traversals, and you must rebuild the tree or describe its shape.
- One traversal gives the root first or last (preorder or postorder). The other is inorder.
- The values are unique. If not, the root's position in inorder is not clear.
