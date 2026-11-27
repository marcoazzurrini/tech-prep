export function cloneData(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(cloneData);
  }

  const copy = {};
  for (const key of Object.keys(value)) {
    copy[key] = cloneData(value[key]);
  }
  return copy;
}
