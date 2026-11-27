export function parkingFee(entry, exit, rate) {
  const stay = Temporal.Instant.from(entry).until(Temporal.Instant.from(exit), {
    largestUnit: "hours",
    smallestUnit: "hours",
    roundingMode: "ceil",
  });

  return stay.hours * rate;
}
