export function createStockRoom() {
  const counts = new Map();
  const count = (item) => counts.get(item) ?? 0;

  return {
    add(item, amount) {
      counts.set(item, count(item) + amount);
    },
    take(item, amount) {
      if (count(item) < amount) {
        return false;
      }

      counts.set(item, count(item) - amount);

      return true;
    },
    count,
  };
}
