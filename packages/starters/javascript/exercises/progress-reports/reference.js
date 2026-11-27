// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function steadyReports(show, ms) {
  let resting = false;
  let kept = null;

  const report = (percent) => {
    if (resting) {
      kept = { percent };
      return;
    }

    show(percent);
    resting = true;

    setTimeout(() => {
      resting = false;

      if (kept) {
        const latest = kept.percent;
        kept = null;
        report(latest);
      }
    }, ms);
  };

  return report;
}
