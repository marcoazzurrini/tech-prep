export function* chunk(source, size) {
  let group = [];

  for (const item of source) {
    group.push(item);

    if (group.length === size) {
      yield group;
      group = [];
    }
  }

  if (group.length > 0) yield group;
}
