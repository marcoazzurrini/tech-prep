export function missingColumns(row, columns) {
  return columns.filter((column) => !Object.hasOwn(row, column));
}
