export function loadOrder(imports, entry) {
  const order = [];
  const seen = new Set();

  const load = (file) => {
    if (seen.has(file)) {
      return;
    }

    seen.add(file);

    for (const dependency of imports[file]) {
      load(dependency);
    }

    order.push(file);
  };

  load(entry);

  return order;
}
