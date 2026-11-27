export function parentNames(Class) {
  const names = [];
  let parent = Object.getPrototypeOf(Class);

  while (parent !== Function.prototype) {
    names.push(parent.name);
    parent = Object.getPrototypeOf(parent);
  }

  return names;
}
