function* counter() {
  let n = 1;
  while (true) yield n++;
}

export function numberAll(...lists) {
  return Iterator.zip([counter(), Iterator.concat(...lists)])
    .map(([place, name]) => place + ". " + name)
    .toArray();
}
