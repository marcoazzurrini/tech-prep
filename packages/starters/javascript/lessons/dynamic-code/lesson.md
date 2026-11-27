# eval and new Function

## eval runs a string

**Code**

```js
function withTax(price) {
  const rate = 0.25;
  return eval("price * (1 + rate)");
}

console.log(withTax(8));
console.log(eval("const n = 4; n * 10"));

let count = 1;
eval("count += 5");
console.log(count);

eval("var made = 1;");
console.log(typeof made);
```

**Output**

```text
10
40
6
undefined
```

**Rule:** `eval(text)` runs the string `text` as code, right where it is called. The code sees the local variables and can change them. `eval` returns the value of the last statement it ran.

`typeof made` is `"undefined"`. In strict mode, and so in every module, a declaration inside `eval` stays inside it. That holds for `var` too.

`eval(42)` returns `42` as it is. Only a string is run as code.

<!-- task -->

## Direct and indirect

**Code**

```js
globalThis.level = "global";

function show() {
  const level = "local";
  const run = eval;

  console.log(eval("level"));
  console.log(run("level"));
  console.log((0, eval)("level"));
}

show();

(0, eval)("var leaked = 1;");
console.log(globalThis.leaked);
```

**Output**

```text
local
global
global
1
```

**Rule:** Only a call written as `eval(...)` is a **direct eval**, and it runs in the local scope. Every other call, such as through another name, is an **indirect eval**. It runs in the global scope, as if the text were a separate script.

`(0, eval)` uses the comma operator. It gives `eval` as a plain value, so the call is no longer written as `eval(...)`.

An indirect eval is in sloppy mode, where strict mode is off, unless its text starts with `"use strict";`. So `var leaked` became a property of the global object.

<!-- task -->

## new Function

**Code**

```js
const area = new Function("width", "height", "return width * height;");

console.log(area(3, 4));
console.log(area.length, area.name);

globalThis.shop = "Corner Shop";

function makeGreeting() {
  const shop = "Local Shop";
  return new Function("return `Welcome to ${shop}`;");
}

console.log(makeGreeting()());
```

**Output**

```text
12
2 anonymous
Welcome to Corner Shop
```

**Rule:** `new Function(...params, body)` builds a function from strings. The last string is the body, and the strings before it name the parameters. The function sees only the global scope, never the variables around the place that built it.

The body is in sloppy mode unless it starts with `"use strict";`, even when it is built inside a module.

**Common mistake:** expecting the function to see a local variable.

**Wrong**

```js
function makeDiscount(percent) {
  return «new Function("price", "return price * (1 - percent / 100);")»;
}

console.log(makeDiscount(10)(50));
```

**Error**

```text
ReferenceError: percent is not defined
```

**Fix**

```js
function makeDiscount(percent) {
  return «(price) => price * (1 - percent / 100)»;
}

console.log(makeDiscount(10)(50));
```

The built function cannot see `percent`, which is local to `makeDiscount`. An arrow function is a closure, so it can. Here no code needs to come from a string at all.

<!-- task -->

## Safer than eval

**Code**

```js
const formats = {
  upper: (text) => text.toUpperCase(),
  lower: (text) => text.toLowerCase(),
  trim: (text) => text.trim(),
};

function format(text, name) {
  if (!Object.hasOwn(formats, name)) {
    return `no format named ${name}`;
  }

  return formats[name](text);
}

console.log(format("  Tea ", "trim"));
console.log(format("Tea", "upper"));
console.log(format("Tea", "constructor"));
console.log(JSON.parse('{"qty": 2, "items": ["pen"]}').items[0]);
```

**Output**

```text
Tea
TEA
no format named constructor
pen
```

**Rule:** Text from outside the program must never reach `eval` or `new Function`, because it could run any code it likes. Look the text up in a table of allowed actions instead. Read data with `JSON.parse`, which never runs code.

`eval` is slow too. The engine cannot optimise a function whose scope a string might change.

`Object.hasOwn` keeps out inherited keys, such as `"constructor"`.

**Common mistake:** reading JSON with `eval`.

**Wrong**

```js
const text = '{"qty": 2}';
const order = «eval(text)»;

console.log(order.qty);
```

**Error**

```text
SyntaxError: Unexpected token ':'
```

**Fix**

```js
const text = '{"qty": 2}';
const order = «JSON.parse(text)»;

console.log(order.qty);
```

At the start of a statement, `{` opens a block, not an object. So `"qty": 2` was a syntax error. `JSON.parse` reads the text as data.

<!-- task -->

## Remember

- `eval(text)` runs the text where it is called. It sees local variables and returns the value of the last statement.
- Only a call written as `eval(...)` is direct. Any other call runs in the global scope, in sloppy mode.
- `new Function(...params, body)` sees only the global scope, and is sloppy unless the body starts with `"use strict";`.
- Never run outside text as code. Use a lookup table for actions and `JSON.parse` for data.
