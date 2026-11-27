export function firstOrFallback(promise, ms, fallback) {
  const late = new Promise((resolve) => {
    setTimeout(() => resolve(fallback), ms);
  });

  return Promise.race([promise, late]);
}
