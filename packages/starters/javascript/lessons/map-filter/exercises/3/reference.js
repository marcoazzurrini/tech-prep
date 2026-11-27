export function knownReadings(readings) {
  return readings.filter((reading) => reading !== null && reading !== undefined);
}
