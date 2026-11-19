import { TreeNode } from "./ds.ts";

export function diameterOfBinaryTree(root: TreeNode | null): number {
  let best = 0;

  function height(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = height(node.left);
    const right = height(node.right);
    // Two-sided: the longest path that bends at this node.
    best = Math.max(best, left + right);
    // One-sided: the parent can extend only the taller side.
    return 1 + Math.max(left, right);
  }

  height(root);
  return best;
}
