export function isInterleave(s1: string, s2: string, s3: string): boolean {
  if (s1.length + s2.length !== s3.length) return false;
  // ok[j] = the first i chars of s1 and the first j chars of s2 can build the first i + j chars of s3.
  const ok = new Array<boolean>(s2.length + 1).fill(false);
  for (let i = 0; i <= s1.length; i++) {
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0 && j === 0) {
        ok[j] = true;
        continue;
      }
      // The last char of the prefix of s3 comes from s1 (ok[j] is still row i - 1) or from s2.
      const fromS1 = i > 0 && ok[j]! && s1[i - 1] === s3[i + j - 1];
      const fromS2 = j > 0 && ok[j - 1]! && s2[j - 1] === s3[i + j - 1];
      ok[j] = fromS1 || fromS2;
    }
  }
  return ok[s2.length]!;
}
