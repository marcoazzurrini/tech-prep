export class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, listener) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name).push(listener);
    return () => this.off(name, listener);
  }

  off(name, listener) {
    const list = this.listeners.get(name) ?? [];
    this.listeners.set(name, list.filter((item) => item !== listener));
  }

  once(name, listener) {
    const wrapper = (...args) => {
      this.off(name, wrapper);
      listener(...args);
    };
    return this.on(name, wrapper);
  }

  emit(name, ...args) {
    for (const listener of this.listeners.get(name) ?? []) {
      listener(...args);
    }
  }
}
