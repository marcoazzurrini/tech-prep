# ++ Before and After

## Old value or new

**Code**

```js
let stock = 5;

console.log(stock++);
console.log(stock);

console.log(++stock);
console.log(stock);
```

**Output**

```text
5
6
7
7
```

**Rule:** `stock++` and `++stock` both add one to the variable. `stock++` gives back the old value, and `++stock` gives back the new one.

`stock--` and `--stock` take one away, in the same two ways.

`x++` is called the **postfix** form, and `++x` the **prefix** form. Alone on a line they do the same thing. The form matters only when the value is used.

**Common mistake:** assigning `x++` back to `x`.

**Wrong**

```js
let visits = 1;

visits = visits++;
console.log(visits);
```

**Output**

```text
1
```

**Fix**

```js
let visits = 1;

«visits++»;
console.log(visits);
```

`visits++` raised the variable to `2` and gave back the old `1`. Then the assignment stored that `1` again. `++` already stores the result, so it needs no `=`.

<!-- task -->

## Inside an expression

**Code**

```js
const queue = ["Ada", "Bo", "Cy"];
let next = 0;

console.log(queue[next++]);
console.log(queue[next++]);
console.log(next);

let n = 1;

console.log(n++ + ++n);
console.log(n);
```

**Output**

```text
Ada
Bo
2
4
3
```

**Rule:** An expression runs left to right. Each `++` changes the variable at once, so everything to its right sees the new value.

`queue[next++]` reads the item at `next`, then moves `next` on. It is a common way to walk through a list.

`n++ + ++n` is `1 + 3`. `n++` gives `1` and makes `n` `2`. Then `++n` makes it `3` and gives `3`.

**Common mistake:** `++` in a loop test, with the variable used in the body.

**Wrong**

```js
const steps = ["mix", "bake", "cool"];
let i = 0;

while (i++ < steps.length) {
  console.log(steps[i]);
}
```

**Output**

```text
bake
cool
undefined
```

**Fix**

```js
const steps = ["mix", "bake", "cool"];
let i = 0;

while («i» < steps.length) {
  console.log(steps[«i++»]);
}
```

The test compared the old `i`, but it had raised `i` before the body ran. So the body started at `1` and ended past the list. Raise `i` after the body has used it.

<!-- task -->

## ++ makes a number

**Code**

```js
let typed = "5";
let joined = "5";

typed++;
joined += 1;

console.log(typed);
console.log(joined);

let missing;

missing++;
console.log(missing);
```

**Output**

```text
6
51
NaN
```

**Rule:** `++` and `--` convert the value to a number first, unless it is a BigInt. So with a string, `x++` does maths where `x += 1` joins text.

`const old = typed++` would give `old` the number `5`, not the string `"5"`. The old value is converted before it is given back.

`5++` is a syntax error. `++` needs a place to store the result: a variable, or a property as in `cart.items++`.

<!-- task -->

## Remember

- `x++` and `++x` both add one. `x++` gives the old value, and `++x` gives the new one.
- The variable changes at once. Everything to the right in the same expression sees the new value.
- `x = x++` leaves `x` as it was.
- `++` and `--` convert to a number first: `"5"` becomes `6`, and `undefined` becomes `NaN`.
