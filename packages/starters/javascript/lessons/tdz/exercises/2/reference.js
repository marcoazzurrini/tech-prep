export function shippingCost(weight) {
  const rates = { light: 4, heavy: 9 };

  function rateFor(kilos) {
    return kilos > 10 ? rates.heavy : rates.light;
  }

  return rateFor(weight);
}
