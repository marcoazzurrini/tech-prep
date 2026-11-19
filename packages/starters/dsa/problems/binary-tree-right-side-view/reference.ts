import { TreeNode } from "./ds.ts";

export function rightSideView(root: TreeNode | null): number[] {
  const view: number[] = [];
  let level: TreeNode[] = root ? [root] : [];
  while (level.length > 0) {
    // `level` holds exactly one level. Its last node is the one you see.
    view.push(level[level.length - 1].val);
    const next: TreeNode[] = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return view;
}
