export function findItinerary(tickets: string[][]): string[] {
  // Sort in reverse, so pop() takes the smallest destination first.
  const sorted = [...tickets].sort((a, b) => {
    const x = a.join(" ");
    const y = b.join(" ");
    return x < y ? 1 : x > y ? -1 : 0;
  });
  const flights = new Map<string, string[]>();
  for (const [src, dst] of sorted) {
    const out = flights.get(src) ?? [];
    out.push(dst);
    flights.set(src, out);
  }

  const route: string[] = [];

  const visit = (airport: string): void => {
    // Use up every ticket out of this airport. pop() deletes the ticket.
    const out = flights.get(airport) ?? [];
    while (out.length > 0) {
      const next = out.pop();
      if (next !== undefined) visit(next);
    }
    // No tickets left here: the airport goes on the route, back to front.
    route.push(airport);
  };

  visit("JFK");
  return route.reverse();
}
