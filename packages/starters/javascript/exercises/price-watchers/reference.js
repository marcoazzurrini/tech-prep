export function createWatcher() {
  const watchers = new Map();

  return {
    watch(key, fn) {
      if (!watchers.has(key)) {
        watchers.set(key, new Set());
      }
      watchers.get(key).add(fn);

      return () => {
        const list = watchers.get(key);
        if (!list) {
          return;
        }
        list.delete(fn);
        if (list.size === 0) {
          watchers.delete(key);
        }
      };
    },
    notify(key, value) {
      const list = watchers.get(key);
      if (!list) {
        return 0;
      }
      for (const fn of list) {
        fn(value);
      }
      return list.size;
    },
    keysHeld() {
      return watchers.size;
    },
  };
}
