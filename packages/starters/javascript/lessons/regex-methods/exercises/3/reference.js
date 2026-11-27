export function toFahrenheit(text) {
  return text.replace(/(-?\d+)C/g, (match, celsius) => {
    return `${Math.round((celsius * 9) / 5 + 32)}F`;
  });
}
