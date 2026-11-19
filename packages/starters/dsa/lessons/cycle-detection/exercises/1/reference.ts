export function canJumpForever(
  n: number,
  jumps: number[][],
  start: number
): boolean {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [from, to] of jumps) graph[from!]!.push(to!);

  const state = new Array<"new" | "onPath" | "done">(n).fill("new");

  const reachesCycle = (square: number): boolean => {
    // A square that is still on the current path closes a cycle.
    if (state[square] === "onPath") return true;
    // A finished square was fully checked: no cycle behind it.
    if (state[square] === "done") return false;
    state[square] = "onPath";
    for (const next of graph[square]!) {
      if (reachesCycle(next)) return true;
    }
    state[square] = "done";
    return false;
  };

  return reachesCycle(start);
}
