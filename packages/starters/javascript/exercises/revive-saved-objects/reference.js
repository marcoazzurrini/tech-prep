export function revive(text, classes) {
  return JSON.parse(text, (key, value) => {
    const saved = value !== null && typeof value === "object" && typeof value.type === "string" && "data" in value;
    if (!saved || !Object.hasOwn(classes, value.type)) {
      return value;
    }
    return Object.assign(Object.create(classes[value.type].prototype), value.data);
  });
}
