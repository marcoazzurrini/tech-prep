// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function spamGuard(post, ms) {
  const timers = new Map();

  return (user, text) => {
    if (timers.has(user)) {
      return false;
    }

    post(user, text);
    timers.set(user, setTimeout(() => timers.delete(user), ms));

    return true;
  };
}
