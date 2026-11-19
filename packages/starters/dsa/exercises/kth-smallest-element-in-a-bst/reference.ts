import { TreeNode } from "./ds.ts";

export function kthSmallest(root: TreeNode | null, k: number): number {
  // Iterative in-order walk: values come out sorted, stop at the k-th.
  const stack: TreeNode[] = [];
  let node = root;
  while (true) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    const top = stack.pop()!;
    if (--k === 0) return top.val;
    node = top.right;
  }
}
