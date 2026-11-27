export function fewerLookups(lookup) {
  const results = new Map();

  return (from, to) => {
    const key = JSON.stringify([from, to]);

    if (!results.has(key)) {
      results.set(key, lookup(from, to));
    }

    return results.get(key);
  };
}
