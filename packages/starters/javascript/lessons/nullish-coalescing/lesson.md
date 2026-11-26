# The ?? Operator

## Only null and undefined

**Code**

```js
const saved = { volume: 0, muted: false, theme: null };

console.log(saved.volume || 50);
console.log(saved.volume ?? 50);
console.log(saved.muted ?? true);
console.log(saved.theme ?? "dark");
console.log(saved.speed ?? 1);
```

**Output**

```text
50
0
false
dark
1
```

```steps
0 ?? 50 => 0
"" ?? "none" => ""
false ?? true => false
NaN ?? 50 => NaN
«null» ?? 50 => 50
«undefined» ?? 50 => 50
```

**Rule:** `a ?? b` gives `b` only when `a` is `null` or `undefined`. It keeps every other value of `a`, even a falsy one. A value that is `null` or `undefined` is called **nullish**.

`0 || 50` gives `50`, and `0 ?? 50` gives `0`. `||` replaces every falsy value. `??` replaces only the two nullish ones.

**Common mistake:** expecting `??` to replace an empty string.

**Wrong**

```js
function greet(user) {
  return `Hello, ${user.name ?? "stranger"}!`;
}

console.log(greet({ name: "" }));
```

**Output**

```text
Hello, !
```

**Fix**

```js
function greet(user) {
  return `Hello, ${user.name «||» "stranger"}!`;
}

console.log(greet({ name: "" }));
```

An empty string is not nullish, so `??` kept it. When an empty value should be replaced too, `||` is the right operator.

<!-- task -->

## The first value that is set

**Code**

```js
function askServer() {
  console.log("asking the server");
  return 30;
}

const page = { size: 0 };
const account = { colour: null };

console.log(page.size ?? askServer());
console.log(page.limit ?? account.limit ?? askServer());
console.log(page.colour ?? account.colour ?? "blue");
```

**Output**

```text
0
asking the server
30
blue
```

**Rule:** A chain `a ?? b ?? c` gives its first value that is not `null` or `undefined`. When there is none, it gives the last value. The right side runs only when the left side is `null` or `undefined`.

`0 ?? askServer()` gives `0` without a call.

`null ?? undefined` gives `undefined`. The last value comes back as it is.

<!-- task -->

## Mixing needs parentheses

**Code**

```js
const box = { width: 0 };

console.log((box.width ?? box.minWidth) || 100);
console.log(box.width ?? (box.minWidth || 100));
```

**Output**

```text
100
0
```

**Rule:** `??` cannot stand beside `||` or `&&` without parentheses. JavaScript refuses to guess which operator goes first. You must group them yourself.

`5 ?? 0 + 1` gives `5`. Maths goes first, so it reads as `5 ?? (0 + 1)`.

**Common mistake:** adding `||` to a `??` expression without parentheses.

**Wrong**

```js
const box = { width: 0 };

console.log(box.width ?? box.minWidth || 100);
```

**Error**

```text
SyntaxError: Unexpected ||
```

**Fix**

```js
const box = { width: 0 };

console.log(«(box.width ?? box.minWidth)» || 100);
```

A `SyntaxError` means the program is not valid JavaScript, so none of it runs. The parentheses say which operator goes first.

<!-- task -->

## Remember

- `a ?? b` gives `b` only when `a` is `null` or `undefined`.
- `??` keeps `0`, `""`, `false` and `NaN`. `||` replaces them.
- The right side runs only when the left side is `null` or `undefined`.
- `??` beside `||` or `&&` needs parentheses.
