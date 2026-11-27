export function resolveFields(record) {
  const entries = Object.entries(record);

  return Promise.all(entries.map(([, value]) => value)).then((values) =>
    Object.fromEntries(entries.map(([key], i) => [key, values[i]]))
  );
}
