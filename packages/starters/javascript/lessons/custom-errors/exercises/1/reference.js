export class TimeoutError extends Error {
  constructor(ms) {
    super(`Timed out after ${ms} ms`);
    this.name = "TimeoutError";
    this.ms = ms;
  }
}
