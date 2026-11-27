export function namesByRole(users) {
  const grouped = Object.groupBy(users, (user) => user.role);
  return Object.fromEntries(
    Object.entries(grouped).map(([role, list]) => [role, list.map((u) => u.name)]),
  );
}
