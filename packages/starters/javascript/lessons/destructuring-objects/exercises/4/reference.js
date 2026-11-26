export function publicProfile(account) {
  const { password, token, ...profile } = account;

  return profile;
}
