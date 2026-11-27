export function longestDistinctRun(text) {
  const inWindow = new Set();
  let start = 0;
  let best = 0;

  for (let end = 0; end < text.length; end++) {
    while (inWindow.has(text[end])) {
      inWindow.delete(text[start]);
      start++;
    }

    inWindow.add(text[end]);
    best = Math.max(best, end - start + 1);
  }

  return best;
}
