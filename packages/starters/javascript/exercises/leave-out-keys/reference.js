export function leaveOut(record, keys) {
  let { ...kept } = record;

  for (const key of keys) {
    const { [key]: dropped, ...others } = kept;
    kept = others;
  }

  return kept;
}
