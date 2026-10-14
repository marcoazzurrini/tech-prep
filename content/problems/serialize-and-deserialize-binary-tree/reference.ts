import { TreeNode } from "./ds.ts";

export class Codec {
  serialize(root: TreeNode | null): string {
    const out: string[] = [];
    const dfs = (node: TreeNode | null) => {
      if (!node) return void out.push("#");
      out.push(String(node.val));
      dfs(node.left);
      dfs(node.right);
    };
    dfs(root);
    return out.join(",");
  }

  deserialize(data: string): TreeNode | null {
    const tokens = data.split(",");
    let i = 0;
    const build = (): TreeNode | null => {
      const token = tokens[i++];
      if (token === "#" || token === undefined) return null;
      const node = new TreeNode(Number(token));
      node.left = build();
      node.right = build();
      return node;
    };
    return build();
  }
}
