export function findPair(numbers, target) {
  const firstIndex = new Map();

  for (let j = 0; j < numbers.length; j++) {
    const partner = target - numbers[j];

    if (firstIndex.has(partner)) {
      return [firstIndex.get(partner), j];
    }

    if (!firstIndex.has(numbers[j])) {
      firstIndex.set(numbers[j], j);
    }
  }

  return null;
}
