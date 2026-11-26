export function finalPath(redirects, path) {
  const seen = [];
  let current = path;

  while (redirects[current] !== undefined) {
    if (seen.includes(current)) {
      return null;
    }

    seen.push(current);
    current = redirects[current];
  }

  return current;
}
