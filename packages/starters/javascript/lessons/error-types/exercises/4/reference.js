export function splitBill(total, people) {
  if (typeof total !== "number" || typeof people !== "number") {
    throw new TypeError("total and people must be numbers");
  }

  if (!Number.isInteger(people) || people < 1) {
    throw new RangeError("people must be a whole number of at least 1");
  }

  return Math.round((total / people) * 100) / 100;
}
