import { TreeNode } from "./ds.ts";

export function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const index = new Map(inorder.map((val, i) => [val, i] as const));
  let next = 0;

  // Build the subtree whose values are inorder[lo..hi].
  const build = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const node = new TreeNode(preorder[next++]!);
    const mid = index.get(node.val)!;
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };

  return build(0, inorder.length - 1);
}
