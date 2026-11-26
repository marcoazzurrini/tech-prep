export function contactLine(person) {
  return (person && (person.phone || person.email)) || "no contact";
}
