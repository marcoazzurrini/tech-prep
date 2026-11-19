import { TreeNode } from "./ds.ts";

export function isBalanced(root: TreeNode | null): boolean {
  // Returns the height, or -1 when the subtree is not balanced.
  function height(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = height(node.left);
    const right = height(node.right);
    // Pass a failure from below straight up.
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }

  return height(root) !== -1;
}
