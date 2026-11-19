export function pacificAtlantic(heights: number[][]): number[][] {
  const rows = heights.length;
  const cols = heights[0]!.length;

  // Walk uphill from an ocean's edge: marks cells that can drain into it.
  const reachable = (starts: [number, number][]): boolean[][] => {
    const seen = heights.map((row) => row.map(() => false));
    const stack = [...starts];
    for (const [r, c] of starts) seen[r]![c] = true;
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]] as const) {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr]![nc] && heights[nr]![nc]! >= heights[r]![c]!) {
          seen[nr]![nc] = true;
          stack.push([nr, nc]);
        }
      }
    }
    return seen;
  };

  const pacificStarts: [number, number][] = [];
  const atlanticStarts: [number, number][] = [];
  for (let c = 0; c < cols; c++) {
    pacificStarts.push([0, c]);
    atlanticStarts.push([rows - 1, c]);
  }
  for (let r = 0; r < rows; r++) {
    pacificStarts.push([r, 0]);
    atlanticStarts.push([r, cols - 1]);
  }
  const pacific = reachable(pacificStarts);
  const atlantic = reachable(atlanticStarts);

  const result: number[][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pacific[r]![c] && atlantic[r]![c]) result.push([r, c]);
    }
  }
  return result;
}
