const links = { A: "B", B: "C", C: null, X: "Y", Y: null };

const nextStop = (stop) =>
  new Promise((resolve) => setTimeout(() => resolve(links[stop] ?? null), 5));

export async function route(start) {
  const stops = [start];
  let next = await nextStop(start);

  while (next !== null) {
    stops.push(next);
    next = await nextStop(next);
  }

  return stops;
}
