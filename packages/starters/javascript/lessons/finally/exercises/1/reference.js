export function runLogged(log, task) {
  log.push("start");
  try {
    return task();
  } finally {
    log.push("end");
  }
}
