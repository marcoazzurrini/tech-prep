export const Logged = (Base) =>
  class extends Base {
    log = [];

    run(input) {
      this.log.push(input);

      return super.run(input);
    }
  };
