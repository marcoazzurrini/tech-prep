export function floorTo(value, digits) {
  const shifted = Number(`${value}e${digits}`);
  return Math.floor(shifted) / 10 ** digits;
}
