export class TransientError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "TransientError";
  }
}

export class RetryError extends Error {
  constructor(attempts, options) {
    super(`failed after ${attempts} attempts`, options);
    this.name = "RetryError";
    this.attempts = attempts;
  }
}

export function retry(task, times) {
  let lastError;

  for (let attempt = 1; attempt <= times; attempt += 1) {
    try {
      return task();
    } catch (error) {
      if (!(error instanceof TransientError)) {
        throw error;
      }

      lastError = error;
    }
  }

  throw new RetryError(times, { cause: lastError });
}
