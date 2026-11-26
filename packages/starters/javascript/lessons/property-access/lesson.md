# Reading Properties

## Dot or brackets

**Code**

```js
const prices = { small: 2, large: 5 };
const size = "large";

console.log(prices.small);
console.log(prices[size]);
console.log(prices["sm" + "all"]);
console.log(prices.size);
```

**Output**

```text
2
5
2
undefined
```

**Rule:** `obj.key` reads the property with exactly that name. `obj[expression]` evaluates the expression first, then reads the property named by its value.

`prices.size` gives `undefined`. The dot does not look at the variable `size`. It looks for a key called `"size"`.

`prices["small"]` gives `2`, the same as `prices.small`.

**Common mistake:** a dot before a variable.

**Wrong**

```js
function cellOf(book, column) {
  return book«.column»;
}

console.log(cellOf({ title: "Dune", year: 1965 }, "year"));
```

**Output**

```text
undefined
```

**Fix**

```js
function cellOf(book, column) {
  return book«[column]»;
}

console.log(cellOf({ title: "Dune", year: 1965 }, "year"));
```

`book.column` asks for a key called `"column"`, and the book has none. `book[column]` uses the value of the variable, which is `"year"`.

<!-- task -->

## Names that need brackets

**Code**

```js
const response = {
  "content-type": "text/html",
  "2nd-try": true,
  "retry after": 30,
  class: "fast",
};

console.log(response["content-type"]);
console.log(response["2nd-try"]);
console.log(response["retry after"]);
console.log(response.class);
```

**Output**

```text
text/html
true
30
fast
```

**Rule:** The dot works only with a plain name: letters, digits, `_` and `$`, not starting with a digit. Every other key needs brackets.

`response.class` gives `"fast"`. A reserved word such as `class` or `for` is allowed after a dot.

`scores[0]` reads the key `"0"`. `scores.0` is a `SyntaxError`.

**Common mistake:** a dash after a dot.

**Wrong**

```js
const css = { "font-size": 16 };

console.log(css«.font-size»);
```

**Error**

```text
ReferenceError: size is not defined
```

**Fix**

```js
const css = { "font-size": 16 };

console.log(css«["font-size"]»);
```

JavaScript read `css.font - size`: a property called `font`, minus a variable called `size`. There is no such variable. Brackets and quotes keep the dash inside the key.

<!-- task -->

## Missing versus throwing

**Code**

```js
const rates = { eur: 1.1, gbp: 1.3 };

function rateFor(code) {
  return rates[code];
}

console.log(rateFor("eur"));
console.log(rateFor("jpy"));
console.log(rateFor("jpy") ?? 1);
console.log(rateFor("eur").toFixed(2));
```

**Output**

```text
1.1
undefined
1
1.10
```

**Rule:** Reading a property that is not there gives `undefined` and does not throw. Reading a property of `undefined` or `null` throws a `TypeError`.

`rates[code] ?? 1` gives `1` when the key is missing. A lookup with a key from outside can always miss.

`(5).label` and `"hi".label` give `undefined`. Only `null` and `undefined` throw.

**Common mistake:** using the result of a lookup that missed.

**Wrong**

```js
const rates = { eur: 1.1, gbp: 1.3 };

function rateFor(code) {
  return rates[code];
}

console.log(rateFor("jpy").toFixed(2));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'rateFor("jpy").toFixed')
```

**Fix**

```js
const rates = { eur: 1.1, gbp: 1.3 };

function rateFor(code) {
  return rates[code];
}

console.log(rateFor("jpy")«?.»toFixed(2));
```

The lookup itself was fine: it gave `undefined`. The next step, `.toFixed`, read a property of `undefined`. With `?.` the chain stops there and gives `undefined`.

<!-- task -->

## Remember

- `obj.key` reads the key called `"key"`. `obj[expr]` reads the key that `expr` gives.
- A key with a dash, a space or a leading digit needs brackets and quotes.
- A missing property gives `undefined`. A property of `undefined` or `null` throws a `TypeError`.
- Guard a lookup that can miss with `?.`, and give it a default with `??`.
