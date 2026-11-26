# Template Literals

## Expressions inside text

**Code**

```js
const item = { name: "pen", price: 3 };
const count = 4;

console.log(`${count} x ${item.name}`);
console.log(`Total: ${count * item.price}`);
console.log(`Bulk order: ${count >= 10}`);
console.log(`${item.name.toUpperCase()}!`);
```

**Output**

```text
4 x pen
Total: 12
Bulk order: false
PEN!
```

```steps
`${2 + 3}` => "5"
`${"pen".length} letters` => "3 letters"
`${3 > 2}` => "true"
```

**Rule:** Backticks make a template literal. Each `${}` in it holds an expression, which is any code that gives a value. The expression is evaluated, and its value goes into the string.

**Common mistake:** writing `${}` inside normal quotes.

**Wrong**

```js
const name = "Ada";

console.log(«"»Hello, ${name}!«"»);
```

**Output**

```text
Hello, ${name}!
```

**Fix**

```js
const name = "Ada";

console.log(«`»Hello, ${name}!«`»);
```

Only backticks read `${}`. Inside `"` or `'` it is plain text, and there is no error to warn you.

<!-- task -->

## Always a string

**Code**

```js
const width = 5;
const label = `${width}`;

console.log(typeof label);
console.log(label === "5");
console.log(`${width}${width}`);
console.log(`${width + width}`);
```

**Output**

```text
string
true
55
10
```

```steps
`${5}` => "5"
`${true}` => "true"
`${5}${5}` => "55"
`${«5 + 5»}` => "10"
```

**Rule:** The value of each `${}` is converted to a string. A template literal always gives a string, even when it holds only a number.

`${width}${width}` gives `"55"`. Each `${}` becomes text, and the two texts sit side by side. To add, put the sum inside one `${}`.

**Common mistake:** printing a value that is missing.

**Wrong**

```js
const user = { name: "Ada" };

console.log(`Welcome back, ${user.«nickname»}!`);
```

**Output**

```text
Welcome back, undefined!
```

**Fix**

```js
const user = { name: "Ada" };

console.log(`Welcome back, ${user.«name»}!`);
```

A template literal does not fail on a missing value. `user.nickname` is `undefined`, and that becomes the text `undefined`.

<!-- task -->

## Line breaks are kept

**Code**

```js
const name = "Ada";
const note = `Dear ${name},
your order is ready.`;

console.log(note);
console.log(note === "Dear Ada,\nyour order is ready.");
```

**Output**

```text
Dear Ada,
your order is ready.
true
```

**Rule:** A template literal can span several lines. Each line break in the code is a line break in the string, the same as `\n`.

`"` and `'` strings cannot span lines. A line break inside them is a `SyntaxError`.

**Common mistake:** indenting the lines of a template.

**Wrong**

```js
function ticket(seat) {
  return `Ticket
«    »Seat ${seat}`;
}

console.log(ticket("4A"));
```

**Output**

```text
Ticket
    Seat 4A
```

**Fix**

```js
function ticket(seat) {
  return `Ticket«\n»Seat ${seat}`;
}

console.log(ticket("4A"));
```

Everything between the backticks is part of the string. That includes the spaces that indent the code. Write `\n`, or start the next line at the left edge.

<!-- task -->

## Templates inside templates

**Code**

```js
const tags = ["js", "css"];
const free = 2;

console.log(`Tags: ${tags.map((tag) => `#${tag}`).join(" ")}`);
console.log(`Seats: ${free > 0 ? `${free} free` : "full"}`);
```

**Output**

```text
Tags: #js #css
Seats: 2 free
```

```steps
`${`a`}b` => "ab"
`${1 > 0 ? `${1} up` : "none"}!` => "1 up!"
```

**Rule:** A template literal is an expression, so it can sit inside the `${}` of another one. The inner template gives its string first. Then that string goes into the outer one.

`\${free}` in a template gives the text `${free}`. The backslash stops `${` from starting an expression.

<!-- task -->

## Remember

- Backticks make a template literal. `${}` holds any expression.
- Each value is converted to a string, and the result is always a string.
- Line breaks and indentation between the backticks are part of the string.
- A template can sit inside the `${}` of another template.
