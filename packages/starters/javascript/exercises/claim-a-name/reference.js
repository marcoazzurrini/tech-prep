export function claim(name, value) {
  if (globalThis[name] !== undefined) {
    return false;
  }

  globalThis[name] = value;

  return true;
}
