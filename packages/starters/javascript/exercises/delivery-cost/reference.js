const RATE = 2;
const EXPRESS_RATE = 3;

export function deliveryCost(km, express) {
  return km * (express ? EXPRESS_RATE : RATE);
}
