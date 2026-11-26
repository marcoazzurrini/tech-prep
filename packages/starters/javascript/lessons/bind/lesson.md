# bind

## bind fixes this

**Code**

```js
const printer = {
  ink: "black",
  print(text) {
    return `${text} in ${this.ink}`;
  },
};

function run(job) {
  return job("Report");
}

const print = printer.print.bind(printer);

console.log(run(print));
console.log(print("Letter"));
```

**Output**

```text
Report in black
Letter in black
```

**Rule:** `fn.bind(obj)` returns a new function, called a **bound function**. Calling it calls `fn` with `this` set to `obj`, however the call is written.

`printer.print.bind(printer)` does not call `print`. It only makes the new function.

`print === printer.print` gives `false`. `bind` leaves the original function as it was.

**Common mistake:** calling `bind` and not keeping what it returns.

**Wrong**

```js
const counter = {
  count: 0,
  increment() {
    this.count += 1;

    return this.count;
  },
};

«counter.increment.bind(counter);»
const increment = counter.increment;

console.log(increment());
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'this.count')
```

**Fix**

```js
const counter = {
  count: 0,
  increment() {
    this.count += 1;

    return this.count;
  },
};

const increment = «counter.increment.bind(counter)»;

console.log(increment());
```

`bind` did not change `counter.increment`. It returned a new function, and the code threw it away. Keep the bound function and call that.

<!-- task -->

## Fixing the first arguments

**Code**

```js
function label(shop, table, dish) {
  return `${shop}, table ${table}: ${dish}`;
}

const cafeLabel = label.bind(null, "Cafe");
const tableFour = label.bind(null, "Cafe", 4);

console.log(cafeLabel(2, "soup"));
console.log(tableFour("tea"));
console.log(cafeLabel.length);
```

**Output**

```text
Cafe, table 2: soup
Cafe, table 4: tea
2
```

**Rule:** The arguments after the first one in `bind` are fixed too. At each call they come first, and the arguments of the call follow them. This is called **partial application**.

`label.bind(null, "Cafe")` passes `null` as `this`, because `label` does not use `this`.

`cafeLabel.length` gives `2`. Two parameters are still open.

**Common mistake:** forgetting that the first argument of `bind` is `this`.

**Wrong**

```js
function label(shop, table, dish) {
  return `${shop}, table ${table}: ${dish}`;
}

const cafeLabel = label.bind(«"Cafe"»);

console.log(cafeLabel(2, "soup"));
```

**Output**

```text
2, table soup: undefined
```

**Fix**

```js
function label(shop, table, dish) {
  return `${shop}, table ${table}: ${dish}`;
}

const cafeLabel = label.bind(«null, "Cafe"»);

console.log(cafeLabel(2, "soup"));
```

**Output**

```text
Cafe, table 2: soup
```

`"Cafe"` became `this`, and no argument was fixed. So `2` landed in `shop`. Put a value for `this` first, then the arguments.

<!-- task -->

## Bound for good

**Code**

```js
function whoAmI() {
  return this.name;
}

const ada = { name: "Ada" };
const bob = { name: "Bob" };

const asAda = whoAmI.bind(ada);

bob.speak = asAda;

console.log(bob.speak());
console.log(asAda.call(bob));
console.log(asAda.bind(bob)());
```

**Output**

```text
Ada
Ada
Ada
```

**Rule:** A bound function keeps its `this` for good. A method call, `call`, `apply` and a second `bind` cannot change it.

`asAda.bind(bob)` makes a new function, but its `this` is still `ada`. A second `bind` can only fix more arguments.

`whoAmI.bind(ada) === whoAmI.bind(ada)` gives `false`. Each `bind` makes a new function.

<!-- task -->

## Remember

- `fn.bind(obj)` returns a new function with `this` fixed to `obj`. It does not call `fn`.
- `fn.bind(obj, a, b)` fixes the first arguments too. The first argument of `bind` is always `this`.
- Keep what `bind` returns. The original function does not change.
- A bound function cannot get another `this`, not from `call` and not from a second `bind`.
