export function firstAnswer(askers) {
  for (const ask of askers) {
    const answer = ask();

    if (answer !== undefined) {
      return answer;
    }
  }

  return "no answer";
}
