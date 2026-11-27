const UNITS = ["KB", "MB", "GB", "TB"];

export function fileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  let size = bytes / 1024;
  let unit = 0;

  while (size >= 1024 && unit < UNITS.length - 1) {
    size /= 1024;
    unit += 1;
  }

  return `${size.toFixed(1)} ${UNITS[unit]}`;
}
