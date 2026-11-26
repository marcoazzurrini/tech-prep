export function duplicateRow(rows, index) {
  const row = rows[index];
  const duplicate = { ...row, cells: [...row.cells] };

  return [...rows.slice(0, index + 1), duplicate, ...rows.slice(index + 1)];
}
