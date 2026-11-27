export class Radio {
  constructor() {
    this.listeners = new Map();
  }

  on(channel, listener) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel).push(listener);
  }

  emit(channel, ...args) {
    const list = this.listeners.get(channel) ?? [];
    for (const listener of list) {
      listener(...args);
    }
    return list.length;
  }
}
