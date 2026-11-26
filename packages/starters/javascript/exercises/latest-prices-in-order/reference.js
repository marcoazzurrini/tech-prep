export function latestPrices(updates) {
  const latest = {};
  const order = [];

  for (const [id, price] of updates) {
    if (!Object.hasOwn(latest, id)) {
      order.push(id);
    }

    latest[id] = price;
  }

  return order.map((id) => [id, latest[id]]);
}
