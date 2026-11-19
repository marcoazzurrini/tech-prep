import { TreeNode } from "./ds.ts";

export function longestEvenPath(root: TreeNode | null): number {
  let best = 0;

  // Longest even chain that starts at `node` and goes down.
  function arm(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = arm(node.left);
    const right = arm(node.right);
    if (node.val % 2 !== 0) return 0;
    // Two-sided: the path that bends at this node.
    best = Math.max(best, left + 1 + right);
    // One-sided: the parent can extend only one arm.
    return 1 + Math.max(left, right);
  }

  arm(root);
  return best;
}
