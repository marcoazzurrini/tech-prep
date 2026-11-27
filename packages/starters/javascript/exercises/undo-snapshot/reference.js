export function takeSnapshot(state, copies = new WeakMap()) {
  if (state === null || typeof state !== "object") {
    return state;
  }
  if (copies.has(state)) {
    return copies.get(state);
  }

  let copy;

  if (state instanceof Date) {
    copy = new Date(state.getTime());
    copies.set(state, copy);
  } else if (state instanceof Map) {
    copy = new Map();
    copies.set(state, copy);
    for (const [key, value] of state) {
      copy.set(key, takeSnapshot(value, copies));
    }
  } else if (state instanceof Set) {
    copy = new Set();
    copies.set(state, copy);
    for (const value of state) {
      copy.add(takeSnapshot(value, copies));
    }
  } else {
    copy = Array.isArray(state) ? [] : {};
    copies.set(state, copy);
    for (const key of Object.keys(state)) {
      copy[key] = takeSnapshot(state[key], copies);
    }
  }

  return copy;
}
