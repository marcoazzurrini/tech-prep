export function walkEveryStreet(streets: number[][], start: number): number[] {
  const out = new Map<number, number[]>(); // corner -> corners its unused streets lead to
  for (const [a, b] of streets) {
    const next = out.get(a) ?? [];
    next.push(b);
    out.set(a, next);
  }

  const route: number[] = [];

  const walk = (corner: number): void => {
    // pop() deletes the street as it is used.
    const next = out.get(corner) ?? [];
    while (next.length > 0) {
      const to = next.pop();
      if (to !== undefined) walk(to);
    }
    // No streets left here: the corner goes on the route, back to front.
    route.push(corner);
  };

  walk(start);
  return route.reverse();
}
