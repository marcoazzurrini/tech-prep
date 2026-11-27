export function sumByCategory(items) {
  return items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, Object.create(null));
}
