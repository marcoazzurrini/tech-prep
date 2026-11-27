Write `findUnreachable(graph, roots)`. `graph` is an object mapping each node name to an array of node names it points to. `roots` is an array of root node names.

Return an array of all node names in `graph` that cannot be reached from any root, sorted alphabetically. Cycles with no path from a root are unreachable.

Example 1: findUnreachable({ a: ["b"], b: ["a"], c: ["d"], d: [] }, ["c"])  ->  ["a", "b"]
Example 2: findUnreachable({ root: ["x"], x: ["root"] }, ["root"])  ->  []
