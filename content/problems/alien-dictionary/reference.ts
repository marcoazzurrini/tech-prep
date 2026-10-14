export function alienOrder(words: string[]): string {
  const graph = new Map<string, Set<string>>();
  for (const word of words) for (const ch of word) if (!graph.has(ch)) graph.set(ch, new Set());
  const indegree = new Map<string, number>([...graph.keys()].map((ch) => [ch, 0]));

  // Each adjacent pair gives at most one rule: the first letters that differ.
  for (let i = 0; i + 1 < words.length; i++) {
    const first = words[i]!;
    const second = words[i + 1]!;
    const len = Math.min(first.length, second.length);
    let j = 0;
    while (j < len && first[j] === second[j]) j++;
    if (j === len) {
      if (first.length > second.length) return ""; // longer word before its own prefix
      continue;
    }
    const [a, b] = [first[j]!, second[j]!];
    if (!graph.get(a)!.has(b)) {
      graph.get(a)!.add(b);
      indegree.set(b, indegree.get(b)! + 1);
    }
  }

  const queue = [...graph.keys()].filter((ch) => indegree.get(ch) === 0).sort();
  for (let head = 0; head < queue.length; head++) {
    for (const next of [...graph.get(queue[head]!)!].sort()) {
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  return queue.length === graph.size ? queue.join("") : ""; // leftovers mean a cycle
}
