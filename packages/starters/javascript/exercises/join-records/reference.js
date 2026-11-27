export function joinRecords(list, separator) {
  return Array.from(list)
    .filter((item) => item !== null && item !== undefined)
    .join(separator);
}
