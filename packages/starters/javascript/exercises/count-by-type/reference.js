const nameOf = (value) => {
  if (value === null) {
    return "null";
  }

  return Array.isArray(value) ? "array" : typeof value;
};

export function countByType(values) {
  const counts = {};

  for (const value of values) {
    const name = nameOf(value);
    counts[name] = (counts[name] ?? 0) + 1;
  }

  return counts;
}
