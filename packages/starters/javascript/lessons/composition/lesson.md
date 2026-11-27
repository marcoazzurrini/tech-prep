# compose and pipe

## pipe runs left to right

**Code**

```js
const pipe = (...fns) => (value) => fns.reduce((result, fn) => fn(result), value);

const trim = (text) => text.trim();
const lower = (text) => text.toLowerCase();
const dashes = (text) => text.replaceAll(" ", "-");

const toSlug = pipe(trim, lower, dashes);

console.log(toSlug("  Summer Sale  "));
console.log(toSlug(" New In"));
```

**Output**

```text
summer-sale
new-in
```

```steps
"  Summer Sale  ".trim() => "Summer Sale"
"Summer Sale".toLowerCase() => "summer sale"
"summer sale".replaceAll(" ", "-") => "summer-sale"
```

**Rule:** `pipe(f, g, h)` returns a new function. It passes its argument to `f`, the result of `f` to `g`, and so on. It returns what the last function gives. One `reduce` does it: the accumulator is the value so far, and each step calls the next function on it.

Each function takes one value and returns one value. `pipe` runs nothing itself. The functions run when `toSlug` is called.

**Common mistake:** leaving out the start value of `reduce`.

**Wrong**

```js
const pipe = (...fns) => (value) => «fns.reduce((result, fn) => fn(result))»;

const trim = (text) => text.trim();
const lower = (text) => text.toLowerCase();

console.log(pipe(trim, lower)("  Summer Sale  "));
```

**Error**

```text
TypeError: text.toLowerCase is not a function. (In 'text.toLowerCase()', 'text.toLowerCase' is undefined)
```

**Fix**

```js
const pipe = (...fns) => (value) => fns.reduce((result, fn) => fn(result)«, value»);

const trim = (text) => text.trim();
const lower = (text) => text.toLowerCase();

console.log(pipe(trim, lower)("  Summer Sale  "));
```

With no start value, `reduce` took the first function, `trim`, as the value so far. So `lower` got a function, not the text, and `value` was never used.

<!-- task -->

## compose runs right to left

**Code**

```js
const pipe = (...fns) => (value) => fns.reduce((result, fn) => fn(result), value);
const compose = (...fns) => (value) => fns.reduceRight((result, fn) => fn(result), value);

const double = (n) => n * 2;
const addTen = (n) => n + 10;

console.log(pipe(double, addTen)(5));
console.log(compose(double, addTen)(5));
console.log(double(addTen(5)));
```

**Output**

```text
20
30
30
```

**Rule:** `compose` runs the functions from right to left: `compose(f, g)(x)` is `f(g(x))`. That is the order of calls nested by hand. `pipe` runs them in reading order instead. The only change is `reduceRight` in place of `reduce`.

`compose(f, g, h)` and `pipe(h, g, f)` build the same function.

**Common mistake:** writing `compose` with `reduce`.

**Wrong**

```js
const compose = (...fns) => (value) => fns.«reduce»((result, fn) => fn(result), value);

const double = (n) => n * 2;
const addTen = (n) => n + 10;

console.log(compose(double, addTen)(5));
```

**Output**

```text
20
```

**Fix**

```js
const compose = (...fns) => (value) => fns.«reduceRight»((result, fn) => fn(result), value);

const double = (n) => n * 2;
const addTen = (n) => n + 10;

console.log(compose(double, addTen)(5));
```

**Output**

```text
30
```

`reduce` starts from the first function, so `double` ran first. That is `pipe`. `compose` must start from the last function.

<!-- task -->

## Several starting arguments

**Code**

```js
const compose = (...fns) =>
  fns.reduce((outer, inner) => (...args) => outer(inner(...args)), (x) => x);

const total = (...prices) => prices.reduce((sum, price) => sum + price, 0);
const label = (amount) => `£${amount}`;

const receipt = compose(label, total);

console.log(receipt(4, 6, 10));
console.log(compose()("as it was"));
```

**Output**

```text
£20
as it was
```

**Rule:** This `compose` reduces the functions themselves. Each step wraps the function so far around the next one. The function it builds hands all its arguments to the function that runs first. Only that one may take several arguments. Every later one gets one result.

The start value `(x) => x` returns its argument unchanged. It makes `compose()` with no functions work, where `reduce` would throw.

`fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(value))` is a `pipe` for steps that may return promises.

**Common mistake:** a built function with one parameter.

**Wrong**

```js
const compose = (...fns) => «(value)» => fns.reduceRight((result, fn) => fn(result), value);

const total = (...prices) => prices.reduce((sum, price) => sum + price, 0);
const label = (amount) => `£${amount}`;

console.log(compose(label, total)(4, 6, 10));
```

**Output**

```text
£4
```

**Fix**

```js
const compose = (...fns) =>
  «fns.reduce((outer, inner) => (...args) => outer(inner(...args)), (x) => x)»;

const total = (...prices) => prices.reduce((sum, price) => sum + price, 0);
const label = (amount) => `£${amount}`;

console.log(compose(label, total)(4, 6, 10));
```

**Output**

```text
£20
```

The built function had one parameter, `value`, so `6` and `10` were dropped, and `total` got only `4`.

<!-- task -->

## Remember

- `pipe(f, g)(x)` is `g(f(x))`: left to right, in reading order. Build it with `reduce`.
- `compose(f, g)(x)` is `f(g(x))`: right to left, like nested calls. Build it with `reduceRight`.
- Pass a start value, so that no functions at all gives the value back unchanged.
- Only the first function to run may take several arguments.
