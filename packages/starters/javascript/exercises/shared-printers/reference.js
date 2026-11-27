export async function printAll(jobs, count) {
  const results = [];
  let next = 0;

  async function printer(number) {
    while (next < jobs.length) {
      const i = next;
      next += 1;
      results[i] = await jobs[i](number);
    }
  }

  const printers = Array.from({ length: Math.min(count, jobs.length) }, (_, number) => printer(number));
  await Promise.all(printers);
  return results;
}
