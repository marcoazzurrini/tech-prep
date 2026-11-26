export function makeSteps(names) {
  const steps = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];

    steps.push(() => `${i + 1}. ${name}`);
  }

  return steps;
}
