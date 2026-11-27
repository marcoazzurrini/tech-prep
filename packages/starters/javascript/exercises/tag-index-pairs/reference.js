export class TagIndex {
  constructor() {
    this.tags = new Map();
  }

  add(tag, item) {
    if (!this.tags.has(tag)) this.tags.set(tag, []);
    this.tags.get(tag).push(item);
  }

  [Symbol.iterator]() {
    const pairs = [];

    for (const [tag, items] of this.tags) {
      for (const item of items) pairs.push([tag, item]);
    }

    return pairs[Symbol.iterator]();
  }
}
