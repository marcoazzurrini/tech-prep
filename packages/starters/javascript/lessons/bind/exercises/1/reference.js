export function describer(book) {
  return book.describe.bind(book);
}
