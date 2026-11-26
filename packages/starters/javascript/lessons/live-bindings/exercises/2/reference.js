export let score = 0;

export function addPoints(points) {
  score += points;
}

export function reset() {
  score = 0;
}
