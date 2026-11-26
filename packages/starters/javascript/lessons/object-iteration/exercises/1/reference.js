export function priciest(menu) {
  let best = null;

  for (const [dish, price] of Object.entries(menu)) {
    if (best === null || price > menu[best]) {
      best = dish;
    }
  }

  return best;
}
