export function createBox(width, height) {
  return {
    width,
    height,
    get area() {
      return this.width * this.height;
    },
    get size() {
      return `${this.width}x${this.height}`;
    },
    set size(text) {
      const [newWidth, newHeight] = text.split("x");

      this.width = Number(newWidth);
      this.height = Number(newHeight);
    },
  };
}
