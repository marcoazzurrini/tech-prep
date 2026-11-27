export function doneTitles(tasks) {
  return tasks.filter((task) => task.done).map((task) => task.title.toUpperCase());
}
