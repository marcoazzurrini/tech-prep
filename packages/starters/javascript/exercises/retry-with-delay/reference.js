// For the tests: a task that rejects with "down" until ms have passed, then fulfils with "up".
export const upAfter = (ms) => {
  let up = false;
  setTimeout(() => {
    up = true;
  }, ms);
  return async () => {
    if (!up) {
      throw new Error("down");
    }
    return "up";
  };
};


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry(fn, times, ms) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= times) {
        throw error;
      }
      await sleep(ms);
    }
  }
}
