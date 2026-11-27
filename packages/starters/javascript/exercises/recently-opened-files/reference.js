export function createRecent(max) {
  const names = [];

  return {
    open(name) {
      const index = names.indexOf(name);

      if (index !== -1) {
        names.splice(index, 1);
      }

      names.unshift(name);

      if (names.length > max) {
        names.length = max;
      }
    },
    list() {
      return [...names];
    },
  };
}
