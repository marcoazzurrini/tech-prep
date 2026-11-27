const stock = { 1: 3, 2: 0, 3: 12, 5: 1 };

function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function loadStock(id) {
  return later(id, 10).then((key) => {
    if (!(key in stock)) {
      throw new Error("unknown item " + key);
    }
    return stock[key];
  });
}

export function stockLabel(id) {
  return loadStock(id)
    .catch(() => 0)
    .then((count) => (count > 0 ? count + " in stock" : "sold out"));
}
