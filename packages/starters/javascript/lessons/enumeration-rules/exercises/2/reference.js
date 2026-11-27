export function publicCopy(obj) {
  const copy = {};

  for (const key of Object.keys(obj)) {
    copy[key] = obj[key];
  }

  return copy;
}
