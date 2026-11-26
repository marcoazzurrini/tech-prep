export function handle(object, name) {
  return (...args) => object[name](...args);
}
