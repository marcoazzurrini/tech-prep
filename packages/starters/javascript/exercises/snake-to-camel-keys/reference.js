const toCamel = (key) => key.replace(/_([a-z\d])/g, (match, char) => char.toUpperCase());

export function camelKeys(value) {
  if (Array.isArray(value)) {
    return value.map(camelKeys);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [toCamel(key), camelKeys(inner)])
    );
  }

  return value;
}
