export function createVolume() {
  let level = 5;

  return {
    up() {
      level = Math.min(level + 1, 10);
    },
    down() {
      level = Math.max(level - 1, 0);
    },
    level: () => level,
  };
}
