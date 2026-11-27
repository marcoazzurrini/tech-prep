export function checkAccess(required, granted) {
  const need = new Set(required);
  const have = new Set(granted);

  if (need.isSubsetOf(have)) {
    return "full";
  }

  return need.isDisjointFrom(have) ? "none" : "partial";
}
