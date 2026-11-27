export function track(log, name) {
  log.push("open " + name);

  return {
    [Symbol.dispose]() {
      log.push("close " + name);
    },
  };
}
