export function largest(amounts) {
  let best = amounts[0];

  for (const amount of amounts) {
    if (amount > best) {
      best = amount;
    }
  }

  return best;
}
