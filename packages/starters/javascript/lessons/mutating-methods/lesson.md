# Methods That Change the Array

## Adding and removing ends

**Code**

```js
const queue = ["Ada", "Bo"];

console.log(queue.push("Cy", "Di"));
console.log(queue.pop());
console.log(queue.unshift("Zoe"));
console.log(queue.shift());
console.log(queue.join(", "));
```

**Output**

```text
4
Di
4
Zoe
Ada, Bo, Cy
```

```steps
["a"].push(«"b"») => 2
["a", "b"].pop() => "b"
["b"].unshift(«"a"») => 2
[].shift() => undefined
```

**Rule:** `push` adds items at the end and `unshift` adds them at the start. Both return the new `length`. `pop` removes the last item and `shift` removes the first. Both return the item they removed, or `undefined` when the array is empty.

To **mutate** an array is to change it in place. All four methods mutate: every name that holds the array sees the change.

`queue.unshift("x", "y")` puts both at the start, in that order: `["x", "y", ...]`.

**Common mistake:** using `pop` to read the last item.

**Wrong**

```js
const history = ["home", "shop", "cart"];
const current = history«.pop()»;

console.log(current);
console.log(history.length);
```

**Output**

```text
cart
2
```

**Fix**

```js
const history = ["home", "shop", "cart"];
const current = history«.at(-1)»;

console.log(current);
console.log(history.length);
```

`pop` gave the right page, but it also took it out of `history`. `at(-1)` only reads.

<!-- task -->

## splice

**Code**

```js
const playlist = ["intro", "song", "ad", "outro"];

const removed = playlist.splice(2, 1);
console.log(removed.join(", "));

playlist.splice(1, 0, "news", "talk");
console.log(playlist.join(", "));

const tail = playlist.splice(-2);
console.log(tail.join(", "));
console.log(playlist.join(", "));
```

**Output**

```text
ad
intro, news, talk, song, outro
song, outro
intro, news, talk
```

**Rule:** `splice(start, count, ...items)` removes `count` items from index `start`, then puts `items` in their place. It returns an array of the removed items, which is empty when it removed none.

A negative `start` counts from the end. With no `count`, `splice` removes everything from `start` to the end.

After a `splice`, the later items move to close the gap or make room. Their indexes change.

**Common mistake:** leaving out the count.

**Wrong**

```js
const todo = ["wash", "cook", "shop", "read"];
todo.splice(«1»);

console.log(todo.join(", "));
```

**Output**

```text
wash
```

**Fix**

```js
const todo = ["wash", "cook", "shop", "read"];
todo.splice(«1, 1»);

console.log(todo.join(", "));
```

Without a count, `splice(1)` removed every item from index `1` on. `splice(1, 1)` removes one.

<!-- task -->

## reverse and fill

**Code**

```js
const levels = [1, 2, 3, 4];
const back = levels.reverse();

console.log(back === levels);
console.log(levels.join(","));

const result = levels.fill(0, 2);
console.log(result === levels);
console.log(levels.join(","));
```

**Output**

```text
true
4,3,2,1
true
4,3,0,0
```

**Rule:** `reverse` and `fill` change the array, then return that same array. The result is not a copy. `fill(value, start, end)` writes `value` from `start` up to, but not including, `end`.

`sort` mutates too, and returns the same array. It has its own lesson.

`copyWithin(target, start)` copies a part of the array over another part, in place: `[1, 2, 3, 4, 5].copyWithin(0, 3)` gives `[4, 5, 3, 4, 5]`.

**Common mistake:** reversing an array that was passed in.

**Wrong**

```js
function newestFirst(posts) {
  return «posts».reverse();
}

const posts = ["old", "mid", "new"];
const feed = newestFirst(posts);

console.log(feed.join(", "));
console.log(posts.join(", "));
```

**Output**

```text
new, mid, old
new, mid, old
```

**Fix**

```js
function newestFirst(posts) {
  return «[...posts]».reverse();
}

const posts = ["old", "mid", "new"];
const feed = newestFirst(posts);

console.log(feed.join(", "));
console.log(posts.join(", "));
```

`reverse` turned the caller's array around, and returned it. Copy first with spread, then reverse the copy.

<!-- task -->

## Remember

- `push`, `pop`, `shift`, `unshift`, `splice`, `reverse`, `sort`, `fill` and `copyWithin` change the array itself.
- `push` and `unshift` return the new `length`. `pop` and `shift` return the removed item.
- `splice(start, count, ...items)` returns an array of the removed items.
- `reverse`, `sort` and `fill` return the same array, not a copy.
