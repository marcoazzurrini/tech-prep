export function createStore(initial) {
  let state = initial;
  let subscribers = [];

  return {
    getState() {
      return state;
    },

    setState(patch) {
      const prev = state;
      state = { ...state, ...patch };
      for (const fn of [...subscribers]) {
        fn(state, prev);
      }
    },

    subscribe(fn) {
      subscribers.push(fn);
      return () => {
        subscribers = subscribers.filter((item) => item !== fn);
      };
    },
  };
}
