const stock = { tea: 12, cake: 0, jam: 5 };

const fetchStock = (item) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Object.hasOwn(stock, item)) {
        resolve(stock[item]);
      } else {
        reject(new Error("unknown item"));
      }
    }, 10);
  });

export function stockReport(items) {
  return Promise.allSettled(items.map((item) => fetchStock(item))).then((results) =>
    results.map((result, i) =>
      result.status === "fulfilled" ? `${items[i]}: ${result.value}` : `${items[i]}: ${result.reason.message}`
    )
  );
}
