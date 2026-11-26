export function tooEarly(imports, entry) {
  const pairs = [];
  const finished = new Map();

  const load = (file) => {
    finished.set(file, false);

    for (const imported of imports[file]) {
      if (!finished.has(imported)) {
        load(imported);
      } else if (!finished.get(imported)) {
        pairs.push([file, imported]);
      }
    }

    finished.set(file, true);
  };

  load(entry);

  return pairs;
}
