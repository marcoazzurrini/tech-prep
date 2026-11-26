export function stockLevel(warehouse, shelf, product) {
  return warehouse[shelf]?.[product] ?? 0;
}
