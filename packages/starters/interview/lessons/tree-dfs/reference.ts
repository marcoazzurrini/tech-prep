import { TreeNode } from "./ds.ts";

export function countLeaves(root: TreeNode | null): number {
  // Base cases: an empty tree has no leaves, and a leaf counts as one.
  if (root === null) return 0;
  if (root.left === null && root.right === null) return 1;
  // The node's answer is the sum of its children's answers.
  return countLeaves(root.left) + countLeaves(root.right);
}
