export function nameTags(person, others) {
  return others.map((other) => person.tag.call(other));
}
