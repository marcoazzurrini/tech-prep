export function attachSecret(obj, value) {
  const key = Symbol("secret");
  obj[key] = value;
  return key;
}
