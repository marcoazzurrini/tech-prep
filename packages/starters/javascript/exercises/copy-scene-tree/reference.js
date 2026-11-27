export class Sprite {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.parent = null;
  }

  add(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  path() {
    return this.parent ? `${this.parent.path()}/${this.name}` : this.name;
  }
}

export function copyTree(root, copies = new WeakMap()) {
  if (root === null || typeof root !== "object") {
    return root;
  }
  if (copies.has(root)) {
    return copies.get(root);
  }

  if (Array.isArray(root)) {
    const copy = [];
    copies.set(root, copy);
    for (const item of root) {
      copy.push(copyTree(item, copies));
    }
    return copy;
  }

  const copy = Object.create(Object.getPrototypeOf(root));
  copies.set(root, copy);
  for (const key of Reflect.ownKeys(root)) {
    copy[key] = copyTree(root[key], copies);
  }
  return copy;
}
