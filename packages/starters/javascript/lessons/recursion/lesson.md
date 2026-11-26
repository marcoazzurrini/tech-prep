# Recursion

## Base case, recursive case

**Code**

```js
function countDigits(n) {
  if (n < 10) {
    return 1;
  }

  return 1 + countDigits(Math.floor(n / 10));
}

console.log(countDigits(7));
console.log(countDigits(4096));
```

**Output**

```text
1
4
```

**Rule:** A **recursive** function calls itself on a smaller input. The **base case** is the input it answers with no further call. Every call must move towards the base case.

`countDigits(7)` is the base case. It returns `1` at once.

`countDigits(4096)` is the recursive case. It gives `1 + countDigits(409)`, and `409` is closer to the base case.

<!-- task -->

## Values come back up

**Code**

```js
function reverse(word) {
  if (word.length <= 1) {
    return word;
  }

  console.log(`waiting for ${word.slice(1)}`);
  const rest = reverse(word.slice(1));
  console.log(`got ${rest}`);

  return rest + word[0];
}

console.log(reverse("abc"));
```

**Output**

```text
waiting for bc
waiting for c
got c
got cb
cba
```

**Rule:** Each call waits on the call stack for the call it made. The deepest call returns first. Each result then goes back up to the caller that waits for it.

**Common mistake:** leaving out `return` before the recursive call.

**Wrong**

```js
function lastItem(list) {
  if (list.length === 1) {
    return list[0];
  }

  «lastItem(list.slice(1));»
}

console.log(lastItem(["tea", "milk", "bread"]));
```

**Output**

```text
undefined
```

**Fix**

```js
function lastItem(list) {
  if (list.length === 1) {
    return list[0];
  }

  «return» lastItem(list.slice(1));
}

console.log(lastItem(["tea", "milk", "bread"]));
```

The deepest call found `"bread"`, but the calls above it dropped the value. Each call must `return` what the call below gave it.

<!-- task -->

## Nested data

**Code**

```js
const photos = {
  size: 2,
  folders: [
    { size: 5, folders: [] },
    { size: 1, folders: [{ size: 4, folders: [] }] },
  ],
};

function totalSize(folder) {
  let total = folder.size;

  for (const inner of folder.folders) {
    total += totalSize(inner);
  }

  return total;
}

console.log(totalSize(photos));
```

**Output**

```text
12
```

**Rule:** Recursion fits data that holds more of itself, such as folders inside folders. Handle one item, then call the function on each item inside it.

`totalSize` has no `if` for its base case. A folder with no folders inside loops zero times, and that ends the recursion.

The code never asks how deep the data goes. Each call handles one level.

<!-- task -->

## Too deep

**Code**

```js
function countUp(n) {
  return 1 + countUp(n + 1);
}

try {
  countUp(0);
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
RangeError
```

**Rule:** Every unfinished call takes room on the call stack, and the room is limited. A recursion that never reaches its base case fills the stack, and JavaScript throws a `RangeError`.

The limit depends on the engine. A correct recursion can reach it too, on very deep data. A loop cannot.

**Common mistake:** a base case that some inputs step past.

**Wrong**

```js
function addUpTo(n) {
  if («n === 0») {
    return 0;
  }

  return n + addUpTo(n - 1);
}

console.log(addUpTo(-2));
```

**Error**

```text
RangeError: Maximum call stack size exceeded.
```

**Fix**

```js
function addUpTo(n) {
  if («n <= 0») {
    return 0;
  }

  return n + addUpTo(n - 1);
}

console.log(addUpTo(-2));
```

`-2` goes to `-3`, then to `-4`. It never equals `0`. A base case with `<=` also stops the inputs that start below it.

<!-- task -->

## Remember

- A recursive function needs a base case, and every call must move towards it.
- Calls wait on the stack. Results come back up, and each call must `return` its own.
- For nested data, handle one item, then recurse into the items inside it.
- Too many unfinished calls throw a `RangeError`.
