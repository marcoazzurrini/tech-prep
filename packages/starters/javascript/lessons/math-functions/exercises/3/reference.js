export function angleOf(x, y) {
  const degrees = (Math.atan2(y, x) * 180) / Math.PI;
  const turned = degrees < 0 ? degrees + 360 : degrees;

  return Math.round(turned);
}
