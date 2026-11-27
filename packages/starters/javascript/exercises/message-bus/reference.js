export class Emitter {
  #listeners = new Map();

  on(name, listener) {
    if (!this.#listeners.has(name)) {
      this.#listeners.set(name, []);
    }
    this.#listeners.get(name).push(listener);
    return () => this.off(name, listener);
  }

  off(name, listener) {
    const list = this.#listeners.get(name) ?? [];
    const index = list.indexOf(listener);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  once(name, listener) {
    const wrapper = (...args) => {
      this.off(name, wrapper);
      listener(...args);
    };
    return this.on(name, wrapper);
  }

  emit(name, ...args) {
    const list = [...(this.#listeners.get(name) ?? [])];
    for (const listener of list) {
      listener(...args);
    }
    return list.length > 0;
  }
}
