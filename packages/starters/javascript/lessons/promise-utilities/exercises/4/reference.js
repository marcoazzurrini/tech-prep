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

export async function retryWithDelays(fn, delays) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === delays.length) {
        throw error;
      }
      await sleep(delays[attempt]);
    }
  }
}
