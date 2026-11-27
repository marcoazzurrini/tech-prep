export function whenReady(check, ms, maxTries, onReady) {
  let tries = 0;
  let id;

  const attempt = () => {
    tries++;
    const value = check();

    if (value === null && tries < maxTries) {
      return false;
    }

    clearInterval(id);
    onReady(value);
    return true;
  };

  if (!attempt()) {
    id = setInterval(attempt, ms);
  }
}
