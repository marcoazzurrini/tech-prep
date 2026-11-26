export function rowToRecord(headers, cells) {
  const record = {};

  for (const [index, header] of headers.entries()) {
    record[header] = cells[index] ?? null;
  }

  return record;
}
