export function encodedTreeDepth(tokens: string[]): number {
  let position = 0;

  // Reads one whole subtree and returns its depth.
  function read(): number {
    const token = tokens[position++];
    // A null mark is an empty subtree. Stop here.
    if (token === "#") return 0;
    // Same order as the writer: left subtree first, then right.
    const left = read();
    const right = read();
    return 1 + Math.max(left, right);
  }

  return read();
}
