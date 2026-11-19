import { TreeNode } from "./ds.ts";

export function maxPathSum(root: TreeNode | null): number {
  let best = -Infinity;

  // Best sum of a path that starts at `node` and goes down one side.
  const gain = (node: TreeNode | null): number => {
    if (!node) return 0;
    const left = Math.max(gain(node.left), 0);
    const right = Math.max(gain(node.right), 0);
    best = Math.max(best, node.val + left + right); // path that bends at this node
    return node.val + Math.max(left, right);
  };

  gain(root);
  return best;
}
