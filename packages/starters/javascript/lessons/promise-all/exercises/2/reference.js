const prices = { tea: 3, cake: 4, jam: 2 };

const fetchPrice = (item) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Object.hasOwn(prices, item)) {
        resolve(prices[item]);
      } else {
        reject(new Error("no price for " + item));
      }
    }, 10);
  });

export function priceList(items) {
  return Promise.all(items.map((item) => fetchPrice(item))).catch((error) => error.message);
}
