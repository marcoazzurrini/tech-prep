const hexByte = (n) => n.toString(16).padStart(2, "0");

export class Colour {
  static BLACK = new Colour(0, 0, 0);
  static WHITE = new Colour(255, 255, 255);

  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static fromHex(hex) {
    const clean = hex.startsWith("#") ? hex.slice(1) : hex;
    const r = Number.parseInt(clean.slice(0, 2), 16);
    const g = Number.parseInt(clean.slice(2, 4), 16);
    const b = Number.parseInt(clean.slice(4, 6), 16);

    return new this(r, g, b);
  }

  static mix(a, b) {
    return new this(
      Math.round((a.r + b.r) / 2),
      Math.round((a.g + b.g) / 2),
      Math.round((a.b + b.b) / 2)
    );
  }

  toHex() {
    return `#${hexByte(this.r)}${hexByte(this.g)}${hexByte(this.b)}`;
  }
}
