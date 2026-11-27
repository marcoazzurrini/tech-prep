export function describeValue(value) {
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) return "plain-object";
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
