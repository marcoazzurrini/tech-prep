export function createScore() {
  return {
    points: 0,
    add(n) {
      this.points += n;

      return this.points;
    },
  };
}
