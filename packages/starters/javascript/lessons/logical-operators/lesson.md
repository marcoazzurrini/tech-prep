# && and || Return a Value

## || gives an operand

**Code**

```js
const user = { nickname: "", email: "ada@example.com" };

console.log(user.nickname || user.email);
console.log(user.email || "Guest");
console.log(user.phone || "no phone");
```

**Output**

```text
ada@example.com
ada@example.com
no phone
```

```steps
"" || "Guest" => "Guest"
"Ada" || "Guest" => "Ada"
0 || «null» => null
null || 0 || "Guest" => "Guest"
```

**Rule:** `a || b` gives `a` when `a` is truthy. Otherwise it gives `b`. The result is one of its two **operands**, the values beside the operator. It is not a boolean.

`null || 0 || "Guest"` gives `"Guest"`. A chain gives its first truthy value, or its last value when none is truthy.

**Common mistake:** using `||` for a default when `0` is a real value.

**Wrong**

```js
function volumeOf(settings) {
  return settings.volume || 50;
}

console.log(volumeOf({ volume: 0 }));
```

**Output**

```text
50
```

**Fix**

```js
function volumeOf(settings) {
  return «settings.volume === undefined ? 50 : settings.volume»;
}

console.log(volumeOf({ volume: 0 }));
```

`0` is falsy, so `||` dropped it and gave the default. Test for the missing value itself. An empty string falls into the same trap.

<!-- task -->

## && gives an operand

**Code**

```js
const guest = { name: "Bo", card: null };
const member = { name: "Ada", card: { points: 120 } };

console.log(guest.card && guest.card.points);
console.log(member.card && member.card.points);
```

**Output**

```text
null
120
```

```steps
«null» && 120 => null
"Ada" && «120» => 120
0 && "points" => 0
1 && "a" && null && "b" => null
```

**Rule:** `a && b` gives `a` when `a` is falsy. Otherwise it gives `b`. The result is one of its two **operands**, the values beside the operator.

`card && card.points` reads `points` only when there is a card. This use of `&&` is called a **guard**.

`1 && "a" && null && "b"` gives `null`. A chain gives its first falsy value, or its last value when none is falsy.

**Common mistake:** guarding with a number that can be `0`.

**Wrong**

```js
function cartLine(items) {
  return items.length && `${items.length} items in your cart`;
}

console.log(cartLine([]));
```

**Output**

```text
0
```

**Fix**

```js
function cartLine(items) {
  return «items.length > 0 ? `${items.length} items in your cart` : "Your cart is empty"»;
}

console.log(cartLine([]));
```

`&&` gave back its left side, and that was `0`. It was not `false` and not an empty text. Say what you want for the empty case.

<!-- task -->

## The right side may not run

**Code**

```js
function loadPrice() {
  console.log("loading the price");
  return 12;
}

const prices = { tea: 9, cake: null };

console.log(prices.tea || loadPrice());
console.log(prices.cake || loadPrice());
console.log(prices.cake && loadPrice());
```

**Output**

```text
9
loading the price
12
null
```

**Rule:** `||` and `&&` evaluate the left side first. When the left side settles the result, the right side never runs. This is called **short-circuit**.

`9 || loadPrice()` gives `9` without a call. A truthy left side settles `||`.

`null && loadPrice()` gives `null` without a call. A falsy left side settles `&&`.

<!-- task -->

## Getting a real boolean

**Code**

```js
const form = { name: "Ada", email: "" };

const complete = form.name && form.email;

console.log(typeof complete);
console.log(typeof !!complete);
console.log(!!complete);
```

**Output**

```text
string
boolean
false
```

**Rule:** `&&` and `||` do not make a boolean. `!!value` does. It gives `true` for a truthy value and `false` for a falsy one.

`Boolean(a && b)` gives the same as `!!(a && b)`.

`!!a && b` converts only `a`. The `!` operators apply before `&&` does.

**Common mistake:** storing the result of `&&` where a yes or no is expected.

**Wrong**

```js
const order = { paid: true, address: "12 Elm Street" };
const status = { ready: order.paid && order.address };

console.log(JSON.stringify(status));
```

**Output**

```text
{"ready":"12 Elm Street"}
```

**Fix**

```js
const order = { paid: true, address: "12 Elm Street" };
const status = { ready: «Boolean(order.paid && order.address)» };

console.log(JSON.stringify(status));
```

`&&` gave back the address, so the status carried it along. `Boolean` turns the result into `true` or `false`.

<!-- task -->

## Remember

- `a || b` gives `a` if it is truthy, else `b`. `a && b` gives `a` if it is falsy, else `b`.
- The result is one of the operands, not a boolean. Use `!!x` or `Boolean(x)` for a boolean.
- The right side runs only when the left side does not settle the result.
- `||` as a default drops `0` and `""`.
