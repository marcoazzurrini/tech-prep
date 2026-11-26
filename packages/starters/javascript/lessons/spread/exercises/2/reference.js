export function updateTask(task, changes) {
  return { ...task, ...changes, id: task.id };
}
