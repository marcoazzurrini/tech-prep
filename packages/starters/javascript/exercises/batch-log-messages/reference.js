export function batch(send) {
  let pending = [];

  return function log(message) {
    if (pending.length === 0) {
      setTimeout(() => {
        const batch = pending;
        pending = [];
        send(batch);
      }, 0);
    }

    pending.push(message);
  };
}
