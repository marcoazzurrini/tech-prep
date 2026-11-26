export function createHistory(initial) {
  const past = [];
  const future = [];
  let current = initial;

  return {
    get: () => current,
    set(value) {
      past.push(current);
      current = value;
      future.length = 0;
    },
    undo() {
      if (past.length === 0) {
        return false;
      }

      future.push(current);
      current = past.pop();

      return true;
    },
    redo() {
      if (future.length === 0) {
        return false;
      }

      past.push(current);
      current = future.pop();

      return true;
    },
  };
}
