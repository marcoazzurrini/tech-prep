const SECONDS = { h: 3600, m: 60, s: 1 };

export function toSeconds(duration) {
  let total = 0;

  for (const part of duration.split(" ")) {
    if (part !== "") {
      total += parseInt(part, 10) * SECONDS[part.at(-1)];
    }
  }

  return total;
}
