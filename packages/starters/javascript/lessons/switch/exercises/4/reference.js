export function contactLine(user) {
  switch (true) {
    case Boolean(user.phone):
      return `call ${user.phone}`;
    case Boolean(user.email):
      return `write to ${user.email}`;
    default:
      return "no contact";
  }
}
