const lookup = (data, path) => {
  let value = data;

  for (const key of path.trim().split(".")) {
    if (value === null || typeof value !== "object" || !Object.hasOwn(value, key)) {
      return "";
    }

    value = value[key];
  }

  return value ?? "";
};

export function fillTemplate(template, data) {
  return template.replace(/\{\{([^}]*)\}\}/g, (match, path) => String(lookup(data, path)));
}
