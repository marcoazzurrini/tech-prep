export function createRobot() {
  return {
    x: 0,
    y: 0,
    east(steps) {
      this.x += steps;

      return this;
    },
    west(steps) {
      this.x -= steps;

      return this;
    },
    north(steps) {
      this.y += steps;

      return this;
    },
    south(steps) {
      this.y -= steps;

      return this;
    },
    position() {
      return [this.x, this.y];
    },
  };
}
