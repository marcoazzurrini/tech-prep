export class Token {
  static #issuing = false;
  static #count = 0;

  #genuine = true;

  constructor(owner) {
    if (!Token.#issuing) {
      throw new TypeError("Use Token.issue(owner) to make a token");
    }

    Token.#issuing = false;
    this.owner = owner;
  }

  static issue(owner) {
    Token.#issuing = true;
    const token = new Token(owner);
    Token.#count += 1;

    return token;
  }

  static verify(value) {
    return typeof value === "object" && value !== null && #genuine in value;
  }

  static count() {
    return Token.#count;
  }
}
