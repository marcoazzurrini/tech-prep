export function firstThatWorks(tasks) {
  let lastError = new Error("no tasks");

  for (const task of tasks) {
    try {
      return task();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
