const normalise = (value) => (typeof value === "string" ? value.toLowerCase() : value);

export class CaseInsensitiveSet extends Set {
  add(value) {
    return super.add(normalise(value));
  }

  has(value) {
    return super.has(normalise(value));
  }

  delete(value) {
    return super.delete(normalise(value));
  }
}
