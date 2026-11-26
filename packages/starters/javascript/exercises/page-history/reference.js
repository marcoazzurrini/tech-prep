export const LIMIT = 3;

export default class History {
  #pages = [];

  visit(page) {
    this.#pages.push(page);

    if (this.#pages.length > LIMIT) {
      this.#pages.shift();
    }
  }

  current() {
    return this.#pages.at(-1) ?? null;
  }

  back() {
    this.#pages.pop();

    return this.current();
  }

  size() {
    return this.#pages.length;
  }
}

export function fromPages(pages) {
  const history = new History();

  for (const page of pages) {
    history.visit(page);
  }

  return history;
}
