export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  // Kahn's algorithm: repeatedly take a course with no unmet prerequisites.
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre!]!.push(course!);
    indegree[course!]!++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);
  for (let head = 0; head < queue.length; head++) {
    for (const course of graph[queue[head]!]!) {
      if (--indegree[course]! === 0) queue.push(course);
    }
  }
  return queue.length === numCourses;
}
