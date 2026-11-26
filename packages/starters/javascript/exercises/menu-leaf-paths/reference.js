export function menuPaths(menu, above = "") {
  const paths = [];

  for (const entry of menu) {
    const path = above === "" ? entry.label : `${above} > ${entry.label}`;

    if (entry.items === undefined) {
      paths.push(path);
    } else {
      paths.push(...menuPaths(entry.items, path));
    }
  }

  return paths;
}
