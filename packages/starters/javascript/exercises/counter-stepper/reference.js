export function makeCounter(step) {
  return {
    step,
    count: 0,
    stepper() {
      const counter = this;

      return function () {
        counter.count += counter.step;

        return counter.count;
      };
    },
  };
}
