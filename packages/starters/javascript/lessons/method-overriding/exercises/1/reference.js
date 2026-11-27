export class Formatter {
  open() {
    return "[";
  }

  close() {
    return "]";
  }

  wrap(text) {
    return this.open() + text + this.close();
  }
}

export class TagFormatter extends Formatter {
  constructor(tag) {
    super();
    this.tag = tag;
  }

  open() {
    return `<${this.tag}>`;
  }

  close() {
    return `</${this.tag}>`;
  }
}
