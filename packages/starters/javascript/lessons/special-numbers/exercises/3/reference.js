export function keepFinite(readings) {
  return readings.filter((reading) => Number.isFinite(reading));
}
