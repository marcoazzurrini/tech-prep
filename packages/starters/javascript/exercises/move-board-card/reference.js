export function moveCard(board, from, index, to) {
  const card = board[from][index];
  const next = { ...board, [from]: board[from].toSpliced(index, 1) };

  return { ...next, [to]: [...next[to], card] };
}
