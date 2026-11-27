export function invertColour(hex) {
  let result = "#";

  for (let i = 1; i < 7; i += 2) {
    const part = parseInt(hex.slice(i, i + 2), 16);
    result += (255 - part).toString(16).padStart(2, "0");
  }

  return result;
}
