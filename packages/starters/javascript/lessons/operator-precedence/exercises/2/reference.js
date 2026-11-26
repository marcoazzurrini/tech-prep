export function canEdit(user) {
  return (user.admin || user.owner) && !user.locked;
}
