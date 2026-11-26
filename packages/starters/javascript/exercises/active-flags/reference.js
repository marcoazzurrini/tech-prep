export function activeFlags(flags) {
  const names = [];

  for (const [name, value] of Object.entries(flags)) {
    if (value) {
      names.push(name);
    }
  }

  return names;
}
