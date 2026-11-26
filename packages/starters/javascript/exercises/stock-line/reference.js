export function stockLine(count, reserved) {
  const left = count - reserved;

  return "Left: " + left + (left > 0 ? " (in stock)" : " (sold out)");
}
