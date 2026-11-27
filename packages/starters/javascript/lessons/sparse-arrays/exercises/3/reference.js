export function describeSlots(list) {
  const result = [];

  for (let i = 0; i < list.length; i++) {
    result.push(i in list ? String(list[i]) : "-");
  }

  return result;
}
