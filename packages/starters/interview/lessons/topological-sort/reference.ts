export function countDoableTasks(n: number, deps: number[][]): number {
  // waiting[t] counts the tasks that must still be done before task t.
  const after: number[][] = Array.from({ length: n }, () => []);
  const waiting = new Array<number>(n).fill(0);
  for (const [a, b] of deps) {
    after[a!]!.push(b!);
    waiting[b!]!++;
  }

  // Take every task that waits for nothing. Taking a task frees the tasks after it.
  const done: number[] = [];
  for (let t = 0; t < n; t++) if (waiting[t] === 0) done.push(t);
  for (let head = 0; head < done.length; head++) {
    for (const next of after[done[head]!]!) {
      if (--waiting[next]! === 0) done.push(next);
    }
  }
  return done.length;
}
