export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  // Words not used yet. Taking a word out marks it as visited.
  const unused = new Set(wordList);
  unused.delete(beginWord);
  let level = [beginWord];
  let length = 1;
  // BFS by levels: every word of `level` ends a ladder of `length` words.
  while (level.length > 0) {
    const nextLevel: string[] = [];
    for (const word of level) {
      if (word === endWord) return length;
      // The neighbours are the unused words with one letter changed.
      for (let i = 0; i < word.length; i++) {
        for (const letter of "abcdefghijklmnopqrstuvwxyz") {
          const candidate = word.slice(0, i) + letter + word.slice(i + 1);
          if (unused.delete(candidate)) nextLevel.push(candidate);
        }
      }
    }
    level = nextLevel;
    length++;
  }
  return 0;
}
