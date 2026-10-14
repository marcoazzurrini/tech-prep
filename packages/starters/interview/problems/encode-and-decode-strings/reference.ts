export function encode(strs: string[]): string {
  // Prefix each string with its length and a '#', e.g. "4#neet".
  return strs.map((s) => `${s.length}#${s}`).join("");
}

export function decode(s: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf("#", i); // end of the length header
    const length = Number(s.slice(i, j));
    result.push(s.slice(j + 1, j + 1 + length));
    i = j + 1 + length;
  }
  return result;
}
