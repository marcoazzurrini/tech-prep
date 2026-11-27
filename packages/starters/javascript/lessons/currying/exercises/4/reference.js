const collect = (items) => (next) =>
  next === undefined ? items : collect([...items, next]);

export function list(item) {
  return collect([item]);
}
