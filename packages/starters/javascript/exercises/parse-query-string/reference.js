export function parseQuery(query) {
  const text = query.startsWith("?") ? query.slice(1) : query;
  const result = {};

  for (const pair of text.split("&")) {
    if (pair === "") {
      continue;
    }

    const [key, ...rest] = pair.split("=");
    result[key] = rest.join("=");
  }

  return result;
}
