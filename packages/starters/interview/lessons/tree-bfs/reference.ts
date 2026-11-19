import { TreeNode } from "./ds.ts";

export function widestLevel(root: TreeNode | null): number {
  let widest = 0;
  const queue: TreeNode[] = root ? [root] : [];
  while (queue.length > 0) {
    // At the start of a level, the queue holds exactly that level.
    const size = queue.length;
    widest = Math.max(widest, size);
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return widest;
}
