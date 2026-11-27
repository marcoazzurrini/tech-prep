export function later(fn, ms) {
  const id = setTimeout(fn, ms);

  return () => clearTimeout(id);
}
