function* walk(node) {
  if (node === null) return;

  yield* walk(node.left);
  yield node.value;
  yield* walk(node.right);
}

export class SortedTree {
  constructor() {
    this.root = null;
  }

  add(value) {
    const node = { value, left: null, right: null };

    if (this.root === null) {
      this.root = node;
      return this;
    }

    let current = this.root;

    while (true) {
      const side = value < current.value ? "left" : "right";

      if (current[side] === null) {
        current[side] = node;
        return this;
      }

      current = current[side];
    }
  }

  *[Symbol.iterator]() {
    yield* walk(this.root);
  }
}
