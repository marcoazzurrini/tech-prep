export function myNew(Ctor, ...args) {
  if (typeof Ctor !== "function") {
    throw new TypeError("myNew needs a function");
  }

  const isObject = (value) => value !== null && (typeof value === "object" || typeof value === "function");

  const obj = Object.create(isObject(Ctor.prototype) ? Ctor.prototype : Object.prototype);
  const result = Ctor.apply(obj, args);
  return isObject(result) ? result : obj;
}
