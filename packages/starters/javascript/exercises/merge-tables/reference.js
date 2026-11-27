export function mergeTables(base, extra) {
  const result = Object.create(null);
  for (const key of Object.keys(base)) {
    result[key] = base[key];
  }
  for (const key of Object.keys(extra)) {
    result[key] = extra[key];
  }
  return result;
}
