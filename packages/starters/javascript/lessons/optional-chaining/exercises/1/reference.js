export function ownerEmail(project) {
  return project.owner?.email ?? "nobody";
}
