# Sweep Unreachable Nodes (medium)

Write `sweepNodes(nodes, roots, removeEdges)`. `nodes` maps each node id to an array of outgoing neighbour ids. `roots` is an array of root node ids. `removeEdges` is an array of `[from, to]` pairs to remove first.

Without mutating `nodes`, remove each listed `[from, to]` edge and return the sorted array of node ids that are no longer reachable from any root.

Example 1:
  const g = { r: ["a", "b"], a: ["b"], b: ["a"] };
  sweepNodes(g, ["r"], [["r", "a"]])  ->  []

Example 2:
  const g = { r: ["a", "b"], a: ["b"], b: ["a"] };
  sweepNodes(g, ["r"], [["r", "a"], ["r", "b"]])  ->  ["a", "b"]
