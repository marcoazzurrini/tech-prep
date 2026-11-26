const PRICES = Object.freeze({ small: 2, large: 3 });

export function coffeePrice(size, extraShot) {
  const price = PRICES[size];

  return extraShot ? price + 1 : price;
}
