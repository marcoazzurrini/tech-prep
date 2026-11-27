export class TaggedList extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  constructor(tag, ...items) {
    super();
    this.tag = tag;
    this.push(...items);
  }

  describe() {
    return `${this.tag} (${this.length})`;
  }
}
