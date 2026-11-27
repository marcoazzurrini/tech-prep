export function findContact(names, query) {
  const found = names.find(
    (name) => name.localeCompare(query, "en", { sensitivity: "base" }) === 0
  );

  return found ?? "";
}
