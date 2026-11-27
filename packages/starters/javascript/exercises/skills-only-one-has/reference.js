export function uniqueSkills(people) {
  const result = {};

  for (const [name, skills] of Object.entries(people)) {
    let others = new Set();

    for (const [otherName, otherSkills] of Object.entries(people)) {
      if (otherName !== name) {
        others = others.union(new Set(otherSkills));
      }
    }

    result[name] = skills.filter((skill) => !others.has(skill));
  }

  return result;
}
