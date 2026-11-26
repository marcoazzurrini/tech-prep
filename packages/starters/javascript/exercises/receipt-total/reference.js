export function receiptTotal(lines) {
  let cents = 0;

  for (const line of lines) {
    if (typeof line === "number") {
      cents += Math.round(line * 100);
    }
  }

  return cents;
}
