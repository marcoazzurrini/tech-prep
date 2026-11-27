export function snakeToCamel(name) {
  const [first, ...rest] = name.split("_");
  const capitalised = rest.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1));

  return first + capitalised.join("");
}
