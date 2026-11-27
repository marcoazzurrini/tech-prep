export function fillPlaceholders(template, data) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.hasOwn(data, key) ? String(data[key]) : match;
  });
}
