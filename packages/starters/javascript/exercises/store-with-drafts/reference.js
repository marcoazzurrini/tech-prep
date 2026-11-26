export function createStore(initial) {
  let data = structuredClone(initial);

  return {
    read() {
      return structuredClone(data);
    },
    update(change) {
      const draft = structuredClone(data);

      change(draft);
      data = draft;
    },
  };
}
