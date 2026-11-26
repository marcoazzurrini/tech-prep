export function shippingCost(weight) {
  if (weight <= 0) {
    return 0;
  }

  if (weight < 5) {
    return 4;
  }

  return weight * 2;
}
