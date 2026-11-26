export function snapshot(list) {
  const saved = [...list];

  return () => [...saved];
}
