// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// For the tests: what promise gives, or "too slow" if it takes more than 50 ms.
export const within = (promise) => {
  let timer;
  const late = new Promise((resolve) => {
    timer = setTimeout(resolve, 50, "too slow");
  });

  return Promise.race([promise, late]).finally(() => clearTimeout(timer));
};

export function suggest(search, ms) {
  let timer;
  let latest;
  let waiting = [];

  return (text) => {
    latest = text;
    clearTimeout(timer);

    timer = setTimeout(() => {
      const resolvers = waiting;
      waiting = [];

      const result = search(latest);

      for (const resolve of resolvers) {
        resolve(result);
      }
    }, ms);

    return new Promise((resolve) => waiting.push(resolve));
  };
}
