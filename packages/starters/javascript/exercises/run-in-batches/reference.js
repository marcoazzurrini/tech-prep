export async function runInBatches(tasks, size) {
  const results = [];

  for (let i = 0; i < tasks.length; i += size) {
    const batch = tasks.slice(i, i + size);
    results.push(...(await Promise.all(batch.map((task) => task()))));
  }

  return results;
}
