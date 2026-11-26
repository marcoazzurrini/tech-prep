# Arguments Are Shared, Not Copied

## One object, two names

**Code**

```js
function birthday(person, count) {
  person.age += 1;
  count += 1;
}

const ada = { name: "Ada", age: 36 };
let years = 36;

birthday(ada, years);

console.log(ada.age);
console.log(years);
```

**Output**

```text
37
36
```

**Rule:** A parameter is a new variable. The call assigns the argument to it, as `=` does. For an object, that copies the reference, so the function and its caller hold one object. A change inside the object shows on both sides. For a primitive, the value is copied.

`count += 1` changed the function's own number. `years` is another variable, so it kept `36`.

**Common mistake:** a helper that changes the array it is given.

**Wrong**

```js
function cheapest(prices) {
  «prices».sort((a, b) => a - b);

  return prices[0];
}

const menu = [12, 7, 9];

console.log(cheapest(menu));
console.log(menu);
```

**Output**

```text
7
[ 7, 9, 12 ]
```

**Fix**

```js
function cheapest(prices) {
  const sorted = «[...prices]».sort((a, b) => a - b);

  return sorted[0];
}

const menu = [12, 7, 9];

console.log(cheapest(menu));
console.log(menu);
```

`sort` changes the array it is called on, and `prices` is the caller's array. The caller asked for a price and got its menu reordered. The fix sorts a copy.

<!-- task -->

## Reassigning stays inside

**Code**

```js
function replace(user) {
  user = { name: "Ben" };
}

function rename(user) {
  user.name = "Ben";
}

const lin = { name: "Lin" };

replace(lin);
console.log(lin.name);

rename(lin);
console.log(lin.name);
```

**Output**

```text
Lin
Ben
```

**Rule:** Reassigning a parameter points the function's own variable at another value. The caller's variable does not change, and neither does the object. Through a parameter, a function can never make the caller's variable hold something else.

This is called **pass by sharing**. The function shares the caller's objects, but not the caller's variables.

**Common mistake:** assigning a new array to the parameter.

**Wrong**

```js
function removeDone(tasks) {
  «tasks =» tasks.filter((task) => !task.done);
}

let todo = [{ done: true }, { done: false }];

removeDone(todo);
console.log(todo.length);
```

**Output**

```text
2
```

**Fix**

```js
function removeDone(tasks) {
  «return» tasks.filter((task) => !task.done);
}

let todo = [{ done: true }, { done: false }];

«todo =» removeDone(todo);
console.log(todo.length);
```

`filter` makes a new array. Assigning it to `tasks` changed the parameter only. Return the new array, and let the caller assign it.

<!-- task -->

## Change, then reassign

**Code**

```js
function update(profile) {
  profile.visits += 1;
  profile = { visits: 0 };
  profile.visits += 50;

  return profile;
}

const mine = { visits: 3 };
const result = update(mine);

console.log(mine.visits);
console.log(result.visits);
console.log(result === mine);
```

**Output**

```text
4
50
false
```

**Rule:** Once a parameter is reassigned, it leads to another object. A change made before that line reaches the caller's object. A change made after it reaches the new one.

`return profile` gives back a reference, not a copy. `result` is the very object that the function built.

<!-- task -->

## Remember

- A parameter is a new variable that is assigned the argument. An object is shared, not copied.
- A change inside the object shows in the caller.
- Reassigning the parameter changes the function's own variable only.
- To leave the caller's data alone, change a copy: `[...list]` or `{ ...obj }`.
