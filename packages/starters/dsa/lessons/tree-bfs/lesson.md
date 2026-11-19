# Tree Level-Order Search

Visit a tree level by level, from the top down. Keep the nodes that wait in a queue. At the start of a level, the queue holds exactly that level. Read its length, then take out that many nodes.

## Worked example

Add up the values of each level.

```ts
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));
const sums: number[] = [];
const queue: TreeNode[] = [root];
while (queue.length > 0) {
  const size = queue.length; // the nodes of one level
  let sum = 0;
  for (let i = 0; i < size; i++) {
    const node = queue.shift()!;
    sum += node.val;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  sums.push(sum);
}
// sums is [1, 5]
```

## Why it works

- A queue is first in, first out. Nodes leave in the order they were found: left to right, level by level.
- `size` is read before the inner loop. Children pushed during the loop belong to the next level, so they are not counted.
- A child is pushed only when it exists, so the queue never holds `null`.

## When to use it

- The task says "level", "row", "depth by depth" or "left to right".
- You need one result per level, or the first or last node of each level.
- You want the nodes nearest to the root first, for example the closest leaf.
