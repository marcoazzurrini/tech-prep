export function safePipe(...fns) {
  return (value) => {
    let result = value;

    for (const fn of fns) {
      if (result === null || result === undefined) {
        return null;
      }

      result = fn(result);
    }

    return result ?? null;
  };
}
