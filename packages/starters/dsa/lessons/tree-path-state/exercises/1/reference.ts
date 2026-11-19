import { TreeNode } from "./ds.ts";

export function countAncestorSumNodes(root: TreeNode | null): number {
  // `above` is the sum of the values on the path above this node.
  function count(node: TreeNode | null, above: number): number {
    if (node === null) return 0;
    const here = node.val === above ? 1 : 0;
    // Add this node's value before passing the sum down.
    const below = above + node.val;
    return here + count(node.left, below) + count(node.right, below);
  }

  return count(root, 0);
}
