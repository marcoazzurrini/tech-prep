export function savedCall(obj, methodName, ...args) {
  return obj[methodName].bind(obj, ...args);
}
