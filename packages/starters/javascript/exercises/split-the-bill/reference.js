export function splitBill(totalCents, people) {
  const extra = totalCents % people;
  const share = (totalCents - extra) / people;

  return Array.from({ length: people }, (_, i) => (i < extra ? share + 1 : share));
}
