export function makeTimer(label, seconds) {
  return {
    label,
    seconds,
    describe() {
      return `${this.label}: ${this.seconds}s`;
    },
  };
}
