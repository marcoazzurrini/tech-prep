# Writing map, filter and reduce

## map by hand

**Code**

```js
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

const prices = [4, 10];

console.log(prices.myMap((price) => price * 2).join(","));
console.log(prices.myMap((price, i, list) => `${i + 1} of ${list.length}: ${price}`).join(" | "));
console.log(prices.join(","));
```

**Output**

```text
8,20
1 of 2: 4 | 2 of 2: 10
4,10
```

**Rule:** A method on `Array.prototype` gets the array as `this`. To write `map`, loop over the indexes of `this`. Call the callback with the item, the index and the array, and collect what it returns in a new array.

Write the method with `function`, not an arrow. An arrow function has no `this` of its own.

The name `myMap` is not a real array method, so it cannot replace one. `filter` is the same loop: push `this[i]` only when the callback returns a truthy value.

**Common mistake:** calling the callback with the item only.

**Wrong**

```js
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(«callback(this[i])»);
  }
  return result;
};

console.log(["tea", "jam"].myMap((item, i) => `${i}: ${item}`).join(", "));
```

**Output**

```text
undefined: tea, undefined: jam
```

**Fix**

```js
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(«callback(this[i], i, this)»);
  }
  return result;
};

console.log(["tea", "jam"].myMap((item, i) => `${i}: ${item}`).join(", "));
```

Callers expect the three arguments of the real `map`. With the item alone, the index parameter got `undefined`.

<!-- task -->

## reduce and its start

**Code**

```js
Array.prototype.myReduce = function (callback, ...start) {
  let index = 0;
  let total;

  if (start.length > 0) {
    total = start[0];
  } else if (this.length > 0) {
    total = this[0];
    index = 1;
  } else {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  for (; index < this.length; index++) {
    total = callback(total, this[index], index, this);
  }
  return total;
};

const add = (sum, n) => sum + n;

console.log([2, 3, 5].myReduce(add));
console.log([2, 3, 5].myReduce(add, 10));
console.log([7].myReduce(() => "never called"));

try {
  [].myReduce(add);
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
10
20
7
TypeError
```

**Rule:** With a start value, the loop begins at index 0. Without one, the first item is the start and the loop begins at index 1. An empty array with no start value has nothing to return, so it throws a `TypeError`.

`...start` collects the arguments after the callback. `start.length` tells whether a start value was passed at all.

`["a", "b"].reduce(add, undefined)` gives `"undefinedab"`. `undefined` is a real start value here. So count the arguments, and do not test whether the start is `undefined`.

**Common mistake:** returning nothing for an empty array.

**Wrong**

```js
Array.prototype.myReduce = function (callback, ...start) {
  let index = 0;
  let total;

  if (start.length > 0) {
    total = start[0];
  } «else {»
    total = this[0];
    index = 1;
  }

  for (; index < this.length; index++) {
    total = callback(total, this[index], index, this);
  }
  return total;
};

try {
  console.log([].myReduce((sum, n) => sum + n));
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
undefined
```

**Fix**

```js
Array.prototype.myReduce = function (callback, ...start) {
  let index = 0;
  let total;

  if (start.length > 0) {
    total = start[0];
  } «else if (this.length > 0) {»
    total = this[0];
    index = 1;
  «} else {
    throw new TypeError("Reduce of empty array with no initial value");»
  }

  for (; index < this.length; index++) {
    total = callback(total, this[index], index, this);
  }
  return total;
};

try {
  console.log([].myReduce((sum, n) => sum + n));
} catch (error) {
  console.log(error.name);
}
```

`this[0]` of an empty array is `undefined`, and the loop never ran. The real `reduce` throws here, so a caller who forgot the start value finds out.

<!-- task -->

## flat with a depth

**Code**

```js
function flat(list, depth = 1) {
  const result = [];
  for (const item of list) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

const menu = ["tea", ["cake", ["tart", ["pie"]]]];

console.log(JSON.stringify(flat(menu)));
console.log(JSON.stringify(flat(menu, 2)));
console.log(JSON.stringify(flat(menu, Infinity)));
console.log(JSON.stringify(flat(menu, 0)));
```

**Output**

```text
["tea","cake",["tart",["pie"]]]
["tea","cake","tart",["pie"]]
["tea","cake","tart","pie"]
["tea",["cake",["tart",["pie"]]]]
```

**Rule:** `flat` takes the items of each inner array up into the result, as many levels down as `depth` says. Recurse into an inner array with `depth - 1`. When `depth` reaches `0`, keep the inner array as it is.

The default depth is `1`, as in the real `flat`.

`Infinity - 1` is `Infinity`, so `flat(list, Infinity)` flattens every level.

**Common mistake:** recursing with the same depth.

**Wrong**

```js
function flat(list, depth = 1) {
  const result = [];
  for (const item of list) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, «depth»));
    } else {
      result.push(item);
    }
  }
  return result;
}

console.log(JSON.stringify(flat(["tea", ["cake", ["tart"]]])));
```

**Output**

```text
["tea","cake","tart"]
```

**Fix**

```js
function flat(list, depth = 1) {
  const result = [];
  for (const item of list) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, «depth - 1»));
    } else {
      result.push(item);
    }
  }
  return result;
}

console.log(JSON.stringify(flat(["tea", ["cake", ["tart"]]])));
```

Each level must use up one step of the depth. With the same depth at every level, the check `depth > 0` was always true, and every level was flattened.

<!-- task -->

## Holes and thisArg

**Code**

```js
Array.prototype.myMap = function (callback, thisArg) {
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

const seats = ["Ada", , "Cy"];
const row = { prefix: "A-" };

let calls = 0;
const labels = seats.myMap(function (name) {
  calls++;
  return this.prefix + name;
}, row);

console.log(calls);
console.log(labels.length, 1 in labels);
console.log(labels.join("|"));
```

**Output**

```text
2
3 false
A-Ada||A-Cy
```

**Rule:** The real `map` skips holes. Test each index with `i in this`, and call the callback only when the item exists. `map` also keeps each hole in its result, so build `new Array(this.length)` and write each result at its own index.

The second argument of `map`, `filter` and `forEach` is `thisArg`: the `this` of each callback call. Pass it with `callback.call(thisArg, ...)`. An arrow callback ignores it.

`filter`, `forEach` and `reduce` skip holes too, and `flat` drops them. `find` and `findIndex` do not: they visit a hole as `undefined`.

**Common mistake:** pushing the results.

**Wrong**

```js
Array.prototype.myMap = function (callback, thisArg) {
  const result = «[]»;
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      «result.push(callback.call(thisArg, this[i], i, this))»;
    }
  }
  return result;
};

const doubled = [1, , 3].myMap((n) => n * 2);
console.log(doubled.length, doubled[1]);
```

**Output**

```text
2 6
```

**Fix**

```js
Array.prototype.myMap = function (callback, thisArg) {
  const result = «new Array(this.length)»;
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      «result[i] = callback.call(thisArg, this[i], i, this)»;
    }
  }
  return result;
};

const doubled = [1, , 3].myMap((n) => n * 2);
console.log(doubled.length, doubled[1]);
```

`push` closed the gap, so `6` moved to index 1 and the length shrank. Each result belongs at the index of its item.

<!-- task -->

## Remember

- A method on `Array.prototype` is a `function` that reads the array as `this`. The callback gets the item, the index and the array.
- `reduce` without a start value starts from the first item, and throws a `TypeError` on an empty array. Count the arguments to know.
- `flat` recurses into inner arrays with `depth - 1`, and the default depth is `1`.
- Skip holes with `i in this`, keep them in `map`'s result, and call the callback with `callback.call(thisArg, ...)`.
