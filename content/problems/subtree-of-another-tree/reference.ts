import { TreeNode } from "./ds.ts";

function same(a: TreeNode | null, b: TreeNode | null): boolean {
  if (!a || !b) return a === b;
  return a.val === b.val && same(a.left, b.left) && same(a.right, b.right);
}

export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return subRoot === null;
  return same(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
