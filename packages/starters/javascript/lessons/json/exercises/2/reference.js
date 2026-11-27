export function redactKeys(obj, hiddenKeys) {
  return JSON.stringify(obj, (key, value) =>
    hiddenKeys.includes(key) ? undefined : value
  );
}
