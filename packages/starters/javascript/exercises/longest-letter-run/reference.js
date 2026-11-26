export function longestRun(text) {
  let best = "";
  let run = "";

  for (const char of text) {
    run = run[0] === char ? run + char : char;

    if (run.length > best.length) {
      best = run;
    }
  }

  return best;
}
