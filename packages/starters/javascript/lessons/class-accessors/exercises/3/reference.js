export class Units {
  static #all = ["mm", "cm", "m"];
  static #default = "cm";

  static get all() {
    return [...Units.#all];
  }

  static get default() {
    return Units.#default;
  }

  static set default(unit) {
    if (!Units.#all.includes(unit)) {
      throw new RangeError(`Unknown unit: ${unit}`);
    }

    Units.#default = unit;
  }
}
