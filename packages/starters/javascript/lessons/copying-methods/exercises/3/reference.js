export function replaceAt(list, index, value) {
  if (index < -list.length || index >= list.length) {
    return [...list];
  }

  return list.with(index, value);
}
