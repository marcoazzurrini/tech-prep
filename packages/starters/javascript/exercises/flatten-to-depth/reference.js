export function flatten(list, depth = 1) {
  const result = [];
  for (let i = 0; i < list.length; i++) {
    if (!(i in list)) {
      continue;
    }
    const item = list[i];
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}
