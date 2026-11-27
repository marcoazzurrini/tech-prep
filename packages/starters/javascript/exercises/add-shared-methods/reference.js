export function addMethods(Constructor, methods) {
  Object.assign(Constructor.prototype, methods);
  return Constructor;
}
