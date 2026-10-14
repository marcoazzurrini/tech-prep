import { TreeNode } from "./ds.ts";

export function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode): TreeNode {
  // Walk down until p and q stop being on the same side.
  let node = root;
  while (true) {
    if (p.val < node.val && q.val < node.val) node = node.left!;
    else if (p.val > node.val && q.val > node.val) node = node.right!;
    else return node;
  }
}
