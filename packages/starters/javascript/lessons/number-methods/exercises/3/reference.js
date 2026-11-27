export function toHexCode(n) {
  return `0x${n.toString(16).toUpperCase().padStart(4, "0")}`;
}
