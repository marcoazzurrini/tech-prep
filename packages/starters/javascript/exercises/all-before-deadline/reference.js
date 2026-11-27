export function allBeforeDeadline(tasks, ms) {
  const deadline = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("deadline passed")), ms);
  });

  return Promise.race([Promise.all(tasks.map((task) => task())), deadline]);
}
