const STAMP = Symbol("stamp");

export function stamp(obj, code) {
  if (Object.hasOwn(obj, STAMP)) return false;
  Object.defineProperty(obj, STAMP, {
    value: code,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return true;
}

export function readStamp(obj) {
  return obj[STAMP];
}
