const lockDeep = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  for (const key of Object.keys(value)) {
    lockDeep(value[key]);
  }

  return value;
};

export function safeSnapshot(data) {
  return lockDeep(structuredClone(data));
}
