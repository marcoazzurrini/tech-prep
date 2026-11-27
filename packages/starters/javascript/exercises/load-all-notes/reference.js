const readAsync = (read, name) =>
  new Promise((resolve, reject) => {
    read(name, (error, text) => (error ? reject(error) : resolve(text)));
  });

export function loadNotes(names, read) {
  return Promise.all(names.map((name) => readAsync(read, name)));
}
