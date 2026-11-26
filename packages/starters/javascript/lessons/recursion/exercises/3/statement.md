A comment has a `text` and `replies`. `replies` is an array of comments, and each of them has its own `replies`, to any depth.

Write `countComments(comment)`. It returns how many comments there are in all: the comment itself, plus every reply below it.

Example 1: countComments({ text: "Nice", replies: [] })  ->  1
Example 2:
  countComments({ text: "Nice", replies: [{ text: "Thanks", replies: [] }, { text: "Agreed", replies: [] }] })
  ->  3
