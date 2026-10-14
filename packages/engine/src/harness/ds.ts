// Data structures shared by solutions and the test harness.
// Solutions import them with `import { ListNode, TreeNode, GraphNode } from "./ds.ts";`

export class ListNode {
  constructor(
    public val: number = 0,
    public next: ListNode | null = null
  ) {}
}

export class TreeNode {
  constructor(
    public val: number = 0,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

export class GraphNode {
  constructor(
    public val: number = 0,
    public neighbors: GraphNode[] = []
  ) {}
}
