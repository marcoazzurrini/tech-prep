export function hops(distance) {
  if (distance <= 0) {
    return 0;
  }

  return 1 + hops(distance - 2);
}
