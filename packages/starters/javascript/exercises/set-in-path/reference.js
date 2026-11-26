export function setIn(data, path, value) {
  if (path.length === 0) {
    return value;
  }

  const [key, ...rest] = path;
  const copy = Array.isArray(data) ? [...data] : { ...data };

  copy[key] = setIn(data[key], rest, value);

  return copy;
}
