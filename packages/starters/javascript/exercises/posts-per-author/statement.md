# Posts per Author (medium)

`postsPerAuthor(posts)` should count the posts of each author. Each post holds its author as an object with an `id` and a `name`. The result is an object with one key for each author's `id`.

The code below counts every post under one key. Fix it.

Example 1: postsPerAuthor([{ title: "Hi", author: { id: 7, name: "Ada" } }])  ->  { "7": 1 }
Example 2: postsPerAuthor([])  ->  {}
