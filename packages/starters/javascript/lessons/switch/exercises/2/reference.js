export function shippingCost(zone) {
  let cost = 0;

  switch (zone) {
    case "local":
      cost = 3;
      break;
    case "national":
      cost = 7;
      break;
    case "abroad":
      cost = 15;
      break;
  }

  return cost;
}
