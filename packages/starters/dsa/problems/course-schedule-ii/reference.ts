export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  // Kahn's algorithm: count the unmet prerequisites of every course.
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre!]!.push(course!);
    indegree[course!]!++;
  }

  // A course with a count of zero can be taken now. The order list is also the queue.
  const order: number[] = [];
  for (let c = 0; c < numCourses; c++) if (indegree[c] === 0) order.push(c);
  for (let head = 0; head < order.length; head++) {
    for (const course of graph[order[head]!]!) {
      if (--indegree[course]! === 0) order.push(course);
    }
  }
  // Courses that were never taken are on a cycle.
  return order.length === numCourses ? order : [];
}
