function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function addFee(total) {
  return later(total + 3, 10);
}

export function checkout(prices) {
  return later(prices, 10)
    .then((list) => {
      return list.reduce((sum, price) => sum + price, 0);
    })
    .then((sum) => {
      return addFee(sum);
    });
}
