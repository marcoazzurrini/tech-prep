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
    const index = list.indexOf(listener);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(name, ...args) {
    for (const listener of [...(this.listeners.get(name) ?? [])]) {
      listener(...args);
    }
  }
}
