import { TreeNode } from "./ds.ts";

export function invertTree(root: TreeNode | null): TreeNode | null {
  if (root) [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}
