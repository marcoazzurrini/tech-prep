export function createThermometer() {
  return {
    celsius: 0,
    get fahrenheit() {
      return (this.celsius * 9) / 5 + 32;
    },
    set fahrenheit(value) {
      this.celsius = ((value - 32) * 5) / 9;
    },
  };
}
