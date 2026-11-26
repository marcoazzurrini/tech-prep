const toCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

export function converterTo(unit) {
  return unit === "C" ? toCelsius : toFahrenheit;
}
