export function badge(user) {
  const { name = "Guest", role = "member" } = user ?? {};

  return `${name} (${role})`;
}
