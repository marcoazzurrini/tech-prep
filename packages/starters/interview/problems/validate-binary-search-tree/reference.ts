import { TreeNode } from "./ds.ts";

export function isValidBST(root: TreeNode | null, low = -Infinity, high = Infinity): boolean {
  // Each node must fit inside the (low, high) window set by its ancestors.
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}
