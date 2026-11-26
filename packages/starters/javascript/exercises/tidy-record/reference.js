const holdsNoData = (value) =>
  value === null || value === undefined || value === "" || Number.isNaN(value);

export function tidyRecord(record) {
  const tidy = {};

  for (const [key, value] of Object.entries(record)) {
    if (!holdsNoData(value)) {
      tidy[key] = value;
    }
  }

  return tidy;
}
