export function makeScore(points, max) {
  return {
    valueOf() {
      return points;
    },
    toString() {
      return `${points}/${max}`;
    },
  };
}
