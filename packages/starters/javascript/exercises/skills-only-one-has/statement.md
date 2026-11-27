# Skills Only One Has (medium)

Write `uniqueSkills(people)`. `people` is an object that maps each person's name to an array of their skills. Nobody lists a skill twice.

Return an object with the same names. Under each name, list the skills that nobody else has, in the order that person listed them.

Example 1:
  uniqueSkills({ Ada: ["js", "sql", "go"], Bo: ["js", "css"], Cy: ["go", "rust"] })
  ->  { Ada: ["sql"], Bo: ["css"], Cy: ["rust"] }

Example 2: uniqueSkills({ A: ["x"], B: ["x"] })  ->  { A: [], B: [] }
Example 3: uniqueSkills({})  ->  {}
