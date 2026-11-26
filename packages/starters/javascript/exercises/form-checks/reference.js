export function runChecks(checks, form, limits) {
  return checks.map((check) => check.apply(form, limits)).filter((error) => error !== null);
}
