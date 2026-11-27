const rules = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%]).{10,}$/;

export function checkPassword(password) {
  return rules.test(password);
}
