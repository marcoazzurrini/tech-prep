export function faithfulCopy(source) {
  return Object.defineProperties({}, Object.getOwnPropertyDescriptors(source));
}
