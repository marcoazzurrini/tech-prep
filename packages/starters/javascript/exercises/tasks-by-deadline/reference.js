export function tasksByDeadline(tasks) {
  return tasks
    .toSorted((a, b) => a.daysLeft - b.daysLeft)
    .map((task) => task.title);
}
