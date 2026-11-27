export class Tag {
  static prefix = "TAG";

  constructor(name) {
    this.name = name;
  }

  static fromText(text) {
    return new this(text.trim());
  }

  label() {
    return `${this.constructor.prefix}:${this.name}`;
  }
}
