export function emptyFields(form) {
  const names = [];

  for (const [name, value] of Object.entries(form)) {
    if (value === "" || value == null) {
      names.push(name);
    }
  }

  return names;
}
