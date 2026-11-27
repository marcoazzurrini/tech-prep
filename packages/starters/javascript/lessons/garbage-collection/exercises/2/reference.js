export function findUnreachable(graph, roots) {
  const marked = new Set();
  const stack = [...roots];

  while (stack.length > 0) {
    const node = stack.pop();
    if (marked.has(node) || !Object.hasOwn(graph, node)) continue;
    marked.add(node);
    for (const next of graph[node]) {
      if (!marked.has(next)) stack.push(next);
    }
  }

  return Object.keys(graph)
    .filter((node) => !marked.has(node))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
