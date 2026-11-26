export function countComments(comment) {
  let count = 1;

  for (const reply of comment.replies) {
    count += countComments(reply);
  }

  return count;
}
