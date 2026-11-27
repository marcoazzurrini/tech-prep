export function sortContacts(contacts) {
  return contacts.toSorted(
    (a, b) =>
      a.last.localeCompare(b.last, "en", { sensitivity: "base" }) ||
      a.first.localeCompare(b.first, "en")
  );
}
