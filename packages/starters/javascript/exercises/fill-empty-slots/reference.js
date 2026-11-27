export function fillHoles(list, value) {
  const result = [];

  for (let i = 0; i < list.length; i++) {
    result.push(i in list ? list[i] : value);
  }

  return result;
}
