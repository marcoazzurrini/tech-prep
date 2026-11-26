export function createThermostat(degrees) {
  return {
    degrees,
    controls() {
      return {
        warmer: () => {
          this.degrees += 1;

          return this.degrees;
        },
        cooler: () => {
          this.degrees -= 1;

          return this.degrees;
        },
      };
    },
  };
}
