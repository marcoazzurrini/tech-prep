const isPresent = (name) => name !== null && name !== undefined;

export function displayName(user) {
  return [user.first, user.middle, user.last].filter(isPresent).join(" ");
}
