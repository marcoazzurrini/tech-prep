export function cloneInstance(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(cloneInstance);
  }

  const copy = Object.create(Object.getPrototypeOf(value));
  for (const key of Reflect.ownKeys(value)) {
    copy[key] = cloneInstance(value[key]);
  }
  return copy;
}
