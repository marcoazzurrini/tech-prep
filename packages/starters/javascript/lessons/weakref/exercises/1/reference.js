export function ownerName(ref) {
  return ref.deref()?.name ?? "gone";
}
