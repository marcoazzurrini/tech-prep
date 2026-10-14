export function longestCommonSubsequence(text1: string, text2: string): number {
  // prev[j] = LCS of the previous prefix of text1 and text2[:j].
  let prev = new Array<number>(text2.length + 1).fill(0);
  for (const a of text1) {
    const cur = [0];
    for (let j = 0; j < text2.length; j++) {
      cur.push(a === text2[j] ? prev[j]! + 1 : Math.max(prev[j + 1]!, cur[j]!));
    }
    prev = cur;
  }
  return prev[text2.length]!;
}
