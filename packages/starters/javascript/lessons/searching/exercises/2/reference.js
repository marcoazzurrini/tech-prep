export function lastPassingStudent(entries) {
  const match = entries.findLast((entry) => entry.score >= 60);
  return match ? match.student : "none";
}
