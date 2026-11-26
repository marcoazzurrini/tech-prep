export function ageGroup(age) {
  let group = "adult";

  if (age < 13) {
    group = "child";
  }

  if (age > 64) {
    group = "senior";
  }

  return group;
}
