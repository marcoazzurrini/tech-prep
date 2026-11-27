const pad = (n) => String(n).padStart(2, "0");

export function offsetLabel(minutes) {
  const sign = minutes > 0 ? "-" : "+";
  const size = Math.abs(minutes);
  return `UTC${sign}${pad(Math.floor(size / 60))}:${pad(size % 60)}`;
}
