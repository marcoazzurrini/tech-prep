export function countRollRoutes(heights: number[][]): number {
  const rows = heights.length;
  const cols = heights[0]!.length;
  // memo[r][c] = number of routes from (r, c) until the ball stops. -1 means not solved yet.
  const memo = heights.map((row) => row.map(() => -1));

  const routes = (r: number, c: number): number => {
    if (memo[r]![c] === -1) {
      let total = 0;
      let moved = false;
      for (const [dr, dc] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          heights[nr]![nc]! < heights[r]![c]!
        ) {
          total += routes(nr, nc);
          moved = true;
        }
      }
      // With no lower neighbour, the ball stops here: one route.
      memo[r]![c] = moved ? total : 1;
    }
    return memo[r]![c]!;
  };

  return routes(0, 0);
}
