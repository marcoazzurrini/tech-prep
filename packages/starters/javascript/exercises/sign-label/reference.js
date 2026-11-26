export function signLabel(x) {
  if (Number.isNaN(x)) {
    return "not a number";
  }

  if (x === 0) {
    return Object.is(x, -0) ? "negative zero" : "zero";
  }

  return x > 0 ? "positive" : "negative";
}
