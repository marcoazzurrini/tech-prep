import { TreeNode } from "./ds.ts";

export function goodNodes(root: TreeNode): number {
  // `highest` is the largest value on the path above this node.
  function count(node: TreeNode | null, highest: number): number {
    if (node === null) return 0;
    const good = node.val >= highest ? 1 : 0;
    // Pass the updated maximum down to both children.
    const next = Math.max(highest, node.val);
    return good + count(node.left, next) + count(node.right, next);
  }

  return count(root, root.val);
}
