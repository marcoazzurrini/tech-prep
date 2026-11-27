export function allWithFallback(promises, fallback) {
  return Promise.allSettled(promises).then((results) =>
    results.map((result) => (result.status === "fulfilled" ? result.value : fallback))
  );
}
