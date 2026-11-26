export function renameColumns(row, names) {
  const renamed = Object.entries(row).map(([key, value]) => [Object.hasOwn(names, key) ? names[key] : key, value]);

  return Object.fromEntries(renamed);
}
