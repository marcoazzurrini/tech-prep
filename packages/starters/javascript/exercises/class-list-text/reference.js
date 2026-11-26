export function classList(...names) {
  return names.filter((name) => name).join(" ");
}
