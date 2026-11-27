export function countTodos(text) {
  return (text.match(/todo/gi) ?? []).length;
}
