export class EventLog {
  constructor() {
    this.entries = [];
  }

  add(text) {
    this.entries.push(text);

    return this;
  }

  size() {
    return this.entries.length;
  }

  last() {
    return this.entries.at(-1) ?? null;
  }
}
