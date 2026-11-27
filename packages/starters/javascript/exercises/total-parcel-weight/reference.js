const weights = { p1: 2, p2: 5, p3: 1 };

const weigh = (id) =>
  new Promise((resolve) => setTimeout(() => resolve(weights[id] ?? 0), 5));

export async function totalWeight(ids) {
  let total = 0;

  for (const id of ids) {
    total += await weigh(id);
  }

  return total;
}
