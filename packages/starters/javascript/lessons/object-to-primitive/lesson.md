# Objects to Primitives

## valueOf, then toString

**Code**

```js
const scores = [5];
const user = { name: "Ada" };

console.log(scores * 2);
console.log(scores + 2);
console.log(user * 2);
console.log(user + "!");
```

**Output**

```text
10
52
NaN
[object Object]!
```

```steps
[5] * 2 => «"5"» * 2
[] + [] => «""» + «""»
[] + {} => «""» + «"[object Object]"»
```

**Rule:** An operator works on primitives. So it turns an object into a primitive first: it calls the object's `valueOf` method, then its `toString` method, and keeps the first result that is a primitive.

`[5].valueOf()` gives the array itself, which is not a primitive. So `toString` decides, and gives `"5"`. A plain object works the same way.

**Common mistake:** joining two arrays with `+`.

**Wrong**

```js
const morning = [1, 2];
const evening = [3, 4];

console.log(morning + evening);
```

**Output**

```text
1,23,4
```

**Fix**

```js
const morning = [1, 2];
const evening = [3, 4];

console.log(«[...morning, ...evening]»);
```

Each array became text, `"1,2"` and `"3,4"`, and `+` joined the two. The spread `...` copies the items into one new array.

<!-- task -->

## Hints pick the order

**Code**

```js
const price = {
  valueOf() {
    return 20;
  },
  toString() {
    return "20 EUR";
  },
};

console.log(price * 2);
console.log(price + 1);
console.log(`${price}`);
console.log(String(price));
```

**Output**

```text
40
21
20 EUR
20 EUR
```

**Rule:** JavaScript converts an object with a **hint**: the type it would like to get. The hint `"string"` calls `toString` first, then `valueOf`. The hints `"number"` and `"default"` call `valueOf` first.

`String(x)`, a template literal and a property key such as `list[x]` use `"string"`. Maths such as `x * 2`, `-x` and `Number(x)` uses `"number"`.

`x + y` uses `"default"`, because `+` can add or join.

**Common mistake:** expecting `+` to call `toString` beside a string.

**Wrong**

```js
const price = {
  valueOf() {
    return 20;
  },
  toString() {
    return "20 EUR";
  },
};

console.log("Total: " + price);
```

**Output**

```text
Total: 20
```

**Fix**

```js
const price = {
  valueOf() {
    return 20;
  },
  toString() {
    return "20 EUR";
  },
};

console.log(«`Total: ${price}`»);
```

`+` always uses the hint `"default"`, so `valueOf` ran first, even beside a string. A template literal asks for a string.

<!-- task -->

## Symbol.toPrimitive goes first

**Code**

```js
const ticket = {
  [Symbol.toPrimitive](hint) {
    console.log(`hint: ${hint}`);
    return hint === "string" ? "ticket #7" : 7;
  },
};

console.log(`${ticket}`);
console.log(ticket * 2);
console.log(ticket + 1);
```

**Output**

```text
hint: string
ticket #7
hint: number
14
hint: default
8
```

**Rule:** When an object has a method under the key `Symbol.toPrimitive`, JavaScript calls only that method. It passes the hint, `"string"`, `"number"` or `"default"`, and uses what the method returns.

`Symbol.toPrimitive` is a built-in **symbol**: a special value that can be a property key. `[Symbol.toPrimitive](hint) { }` writes a method under that key.

When no method gives a primitive, the conversion throws a `TypeError`.

<!-- task -->

## A Date prefers text

**Code**

```js
const start = new Date(1000);
const end = new Date(4000);

console.log(end - start);
console.log(typeof (end - 1));
console.log(typeof (end + 1));
console.log(+end);
```

**Output**

```text
3000
number
string
4000
```

**Rule:** With the hint `"default"`, a `Date` becomes a string. Every other built-in object treats `"default"` as `"number"`. So `date - 1` does maths, but `date + 1` joins text.

`new Date(1000)` is the moment 1000 milliseconds after the start of 1970. With the hint `"number"`, a date becomes that count.

**Common mistake:** adding time to a date with `+`.

**Wrong**

```js
const start = new Date(0);
const oneDay = 86_400_000;
const next = start + oneDay;

console.log(typeof next);
```

**Output**

```text
string
```

**Fix**

```js
const start = new Date(0);
const oneDay = 86_400_000;
const next = «start.getTime()» + oneDay;

console.log(typeof next);
```

The date became text, and `+` joined the number to it. `getTime()` gives the milliseconds as a number, so `+` adds.

<!-- task -->

## Remember

- An object becomes a primitive before an operator uses it: by `[Symbol.toPrimitive]` if it has one, else by `valueOf` and `toString`.
- Maths and `+` try `valueOf` first. `String(x)` and template literals try `toString` first.
- An array or a plain object ends up as its text: `[] + []` is `""`, `[] + {}` is `"[object Object]"`, `[5] * 2` is `10`.
- A `Date` becomes text with `+`, and a number with `-`.
