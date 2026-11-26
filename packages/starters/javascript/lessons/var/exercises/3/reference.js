export function menu(title, dishes) {
  const heading = title + ":";
  const lines = [];

  for (const dish of dishes) {
    lines.push("- " + dish);
  }

  return [heading, ...lines].join(" ");
}
