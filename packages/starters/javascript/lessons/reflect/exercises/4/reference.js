export function buildAll(Class, argLists) {
  return argLists.map((args) => Reflect.construct(Class, args));
}
