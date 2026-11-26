export function readPairs(flat) {
  const result = {};
  let i = 0;

  while (i < flat.length) {
    const key = flat[i++];
    const value = flat[i++];

    result[key] = value;
  }

  return result;
}
