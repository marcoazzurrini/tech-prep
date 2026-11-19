import { TreeNode } from "./ds.ts";

export function bstFloor(root: TreeNode | null, target: number): number | null {
  let best: number | null = null;
  let node = root;
  while (node !== null) {
    if (node.val === target) return target;
    if (node.val < target) {
      // A candidate. Only the right subtree can hold a larger one.
      best = node.val;
      node = node.right;
    } else {
      // Too large. Everything on the right is larger still.
      node = node.left;
    }
  }
  return best;
}
