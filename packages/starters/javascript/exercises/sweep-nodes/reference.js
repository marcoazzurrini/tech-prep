export function sweepNodes(nodes, roots, removeEdges) {
  const adj = {};
  for (const [id, list] of Object.entries(nodes)) {
    adj[id] = [...list];
  }
  for (const [from, to] of removeEdges) {
    if (Object.hasOwn(adj, from)) {
      adj[from] = adj[from].filter((n) => n !== to);
    }
  }

  const marked = Object.create(null);
  const stack = [...roots];
  while (stack.length > 0) {
    const id = stack.pop();
    if (marked[id] || !Object.hasOwn(adj, id)) continue;
    marked[id] = true;
    for (const next of adj[id]) {
      if (!marked[next]) stack.push(next);
    }
  }

  return Object.keys(adj)
    .filter((id) => !marked[id])
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
