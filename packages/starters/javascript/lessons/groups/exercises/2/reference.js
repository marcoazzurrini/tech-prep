export function formatPhone(digits) {
  return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
}
