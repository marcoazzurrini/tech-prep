export function laterValue(value, ms) {
  return {
    then(resolve) {
      setTimeout(() => resolve(value), ms);
    },
  };
}
