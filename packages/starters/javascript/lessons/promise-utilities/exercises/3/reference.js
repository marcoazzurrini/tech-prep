export async function retryIf(fn, times, shouldRetry) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= times || !shouldRetry(error)) {
        throw error;
      }
    }
  }
}
