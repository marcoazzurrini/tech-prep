export function findPrice(menu, dish) {
  for (const item of menu) {
    if (item.dish === dish) {
      return item.price;
    }
  }

  return null;
}
