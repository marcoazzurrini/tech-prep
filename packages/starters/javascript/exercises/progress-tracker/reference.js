export function createProgress(total) {
  let done = 0;

  return {
    get done() {
      return done;
    },
    set done(value) {
      if (value < 0 || value > total) {
        throw new RangeError(`done must be from 0 to ${total}`);
      }

      done = value;
    },
    get percent() {
      return Math.round((done / total) * 100);
    },
    get isComplete() {
      return done === total;
    },
  };
}
