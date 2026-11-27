export class MemoryStore {
  #data = {};

  get(key) {
    return this.#data[key];
  }

  set(key, value) {
    this.#data[key] = value;
    return this;
  }
}

export function addUndo(Base) {
  return class extends Base {
    #history = [];

    set(key, value) {
      this.#history.push({ key, before: this.get(key) });

      return super.set(key, value);
    }

    undo() {
      const last = this.#history.pop();

      if (!last) {
        return false;
      }

      super.set(last.key, last.before);

      return true;
    }
  };
}
