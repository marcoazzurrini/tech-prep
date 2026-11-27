export function firstMissingCode(allowed, codes) {
  const index = codes.findIndex((code) => !allowed.includes(code));
  return index === -1 ? null : codes[index];
}
