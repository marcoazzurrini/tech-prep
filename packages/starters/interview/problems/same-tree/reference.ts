import { TreeNode } from "./ds.ts";

export function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p || !q) return p === q; // both empty, or exactly one missing
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
