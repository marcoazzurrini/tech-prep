export function minDistance(word1: string, word2: string): number {
  // prev[j] = edits to turn the previous prefix of word1 into word2[:j].
  let prev = Array.from({ length: word2.length + 1 }, (_, j) => j);
  for (let i = 1; i <= word1.length; i++) {
    const cur = [i]; // delete all i chars to reach the empty prefix
    for (let j = 1; j <= word2.length; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        cur.push(prev[j - 1]!); // same char: no edit
      } else {
        // replace, delete from word1, or insert into word1
        cur.push(1 + Math.min(prev[j - 1]!, prev[j]!, cur[j - 1]!));
      }
    }
    prev = cur;
  }
  return prev[word2.length]!;
}
