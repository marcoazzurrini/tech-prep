export function monthlyTotals(payments, zone) {
  const totals = new Map();

  for (const { at, amount } of payments) {
    const local = Temporal.Instant.from(at).toZonedDateTimeISO(zone);
    const month = local.toPlainDate().toPlainYearMonth().toString();
    totals.set(month, (totals.get(month) ?? 0) + amount);
  }

  return [...totals]
    .map(([month, total]) => ({ month, total }))
    .toSorted((a, b) => a.month.localeCompare(b.month));
}
