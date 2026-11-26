function withUnit(amount, unit) {
  return `${amount} ${unit}`;
}

export function listWeights(weights, unit) {
  const labels = [];

  for (const weight of weights) {
    labels.push(withUnit(weight, unit));
  }

  return labels;
}
