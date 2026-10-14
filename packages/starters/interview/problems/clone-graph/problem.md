# Clone Graph (medium)

You are given one node of a connected undirected graph (or `None`/`null` for an empty graph). Each node has an integer `val` and a list `neighbors`. Return a deep copy of the graph: a brand-new node for every original node, wired up the same way. No node of the copy may be an original node.

Graphs are written as adjacency lists: entry `i` lists the neighbours of the node with value `i + 1`, and the node with value 1 is the one passed in.

Example 1: adjList = [[2, 4], [1, 3], [2, 4], [1, 3]]  ->  [[2, 4], [1, 3], [2, 4], [1, 3]]  (a 4-node cycle)
Example 2: adjList = [[]]  ->  [[]]  (a single node with no neighbours)
Example 3: adjList = []  ->  []  (empty graph)

Constraints: 0 <= number of nodes <= 100, node values are 1..n and unique, no self-loops or repeated edges.
