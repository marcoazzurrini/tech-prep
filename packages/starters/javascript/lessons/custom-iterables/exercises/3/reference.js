export class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
    return this;
  }

  [Symbol.iterator]() {
    const items = this.items;
    let index = items.length;

    return {
      next() {
        if (index === 0) return { value: undefined, done: true };
        index--;
        return { value: items[index], done: false };
      },
    };
  }
}
