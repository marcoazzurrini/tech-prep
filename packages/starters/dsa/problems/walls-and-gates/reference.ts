export function wallsAndGates(rooms: number[][]): void {
  const rows = rooms.length;
  const cols = rooms[0]!.length;
  const empty = 2147483647;
  // Start the queue with every gate, so the BFS spreads from all of them at once.
  const queue: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r]![c] === 0) queue.push([r, c]);
    }
  }
  for (let head = 0; head < queue.length; head++) {
    const [r, c] = queue[head]!;
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]] as const) {
      // A room that is still empty is reached now for the first time: from its nearest gate.
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && rooms[nr]![nc] === empty) {
        rooms[nr]![nc] = rooms[r]![c]! + 1;
        queue.push([nr, nc]);
      }
    }
  }
}
