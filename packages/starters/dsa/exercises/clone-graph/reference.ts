import { GraphNode } from "./ds.ts";

export function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;
  const copies = new Map<GraphNode, GraphNode>([[node, new GraphNode(node.val)]]); // original -> clone
  const queue: GraphNode[] = [node];
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head]!;
    for (const neighbor of current.neighbors) {
      if (!copies.has(neighbor)) {
        copies.set(neighbor, new GraphNode(neighbor.val));
        queue.push(neighbor);
      }
      copies.get(current)!.neighbors.push(copies.get(neighbor)!);
    }
  }
  return copies.get(node)!;
}
