const collect = (node, prefix, flat) => {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix === null ? key : `${prefix}.${key}`;

    if (value !== null && typeof value === "object") {
      collect(value, path, flat);
    } else {
      flat[path] = value;
    }
  }

  return flat;
};

export function flattenSettings(settings) {
  return collect(settings, null, {});
}
