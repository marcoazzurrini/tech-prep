export function touch(visits, page) {
  const count = (visits[page] ?? 0) + 1;

  delete visits[page];
  visits[page] = count;

  return visits;
}
