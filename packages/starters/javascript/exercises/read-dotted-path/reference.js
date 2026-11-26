export function readPath(data, path) {
  let current = data;

  for (const name of path.split(".")) {
    if (current === null || current === undefined) {
      return "missing";
    }

    current = current[name];
  }

  return current === undefined ? "missing" : current;
}
