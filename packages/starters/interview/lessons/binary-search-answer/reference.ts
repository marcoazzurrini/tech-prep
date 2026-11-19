export function minPrintTime(seconds: number[], pages: number): number {
  const enough = (t: number): boolean => {
    let done = 0;
    for (const s of seconds) done += Math.floor(t / s);
    return done >= pages;
  };

  // The fastest printer alone finishes the job in min(seconds) * pages seconds.
  let lo = 1;
  let hi = Math.min(...seconds) * pages;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (enough(mid)) hi = mid; // enough time: keep it and try less
    else lo = mid + 1; // not enough: the answer is larger
  }
  return lo;
}
