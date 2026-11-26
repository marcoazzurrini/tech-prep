export function firstOverBudget(items, budget) {
  let spent = 0;

  for (const [index, item] of items.entries()) {
    spent += item.price;

    if (spent > budget) {
      return { index, name: item.name };
    }
  }

  return null;
}
