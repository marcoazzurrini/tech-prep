import { TreeNode } from "./ds.ts";

export function levelOrder(root: TreeNode | null): number[][] {
  const levels: number[][] = [];
  let level: TreeNode[] = root ? [root] : [];
  while (level.length > 0) {
    levels.push(level.map((node) => node.val));
    level = level.flatMap((node) => [node.left, node.right].filter((c): c is TreeNode => c !== null));
  }
  return levels;
}
