# switch

## Matching uses ===

**Code**

```js
const rating = "5";

switch (rating) {
  case 5:
    console.log("number five");
    break;
  case "5":
    console.log("text five");
    break;
  default:
    console.log("no match");
}
```

**Output**

```text
text five
```

**Rule:** `switch (x)` compares `x` with each `case` using `===`. Nothing is converted, so the text `"5"` does not match the number `5`.

`default` runs when no `case` matches.

`switch (NaN)` never matches `case NaN`, because `NaN === NaN` is false.

**Common mistake:** switching on text that came from a form.

**Wrong**

```js
const form = { quantity: "2" };

switch («form.quantity») {
  case 1:
    console.log("one ticket");
    break;
  case 2:
    console.log("a pair of tickets");
    break;
  default:
    console.log("a group");
}
```

**Output**

```text
a group
```

**Fix**

```js
const form = { quantity: "2" };

switch («Number(form.quantity)») {
  case 1:
    console.log("one ticket");
    break;
  case 2:
    console.log("a pair of tickets");
    break;
  default:
    console.log("a group");
}
```

**Output**

```text
a pair of tickets
```

The form gave the text `"2"`, and `"2" === 2` is false. Convert the value first, so both sides have one type.

<!-- task -->

## Fall-through

**Code**

```js
const size = "small";

switch (size) {
  case "small":
    console.log("add 1 scoop");
  case "medium":
    console.log("add 2 scoops");
    break;
  case "large":
    console.log("add 3 scoops");
}
```

**Output**

```text
add 1 scoop
add 2 scoops
```

**Rule:** `switch` jumps to the matching `case` and runs from there until a `break`. Without a `break`, it runs on into the next case. This is called **fall-through**.

`case "medium":` is only a place to jump to. Once the code is running, a `case` line is not tested again.

`break` leaves the whole `switch`. That is why `add 3 scoops` is not printed.

<!-- task -->

## Groups and default

**Code**

```js
function seat(ticket) {
  switch (ticket) {
    case "gold":
    case "silver":
      console.log("front rows");
      break;
    default:
      console.log("ticket not known");
    case "basic":
      console.log("back rows");
  }
}

seat("silver");
seat("basic");
seat("free");
```

**Output**

```text
front rows
back rows
ticket not known
back rows
```

**Rule:** Cases with no code between them share one body. `default` is used only when no `case` matches, wherever it stands. From there it falls through like any case.

`seat("basic")` prints one line. Every `case` is tested before `default` is used, also the ones below it.

`case "gold":` has no code and no `break`, so it falls through into `case "silver":`. This is fall-through used on purpose.

<!-- task -->

## switch (true) and return

**Code**

```js
function delivery(weight) {
  switch (true) {
    case weight <= 1:
      return "letter";
    case weight <= 20:
      return "parcel";
    default:
      return "freight";
  }
}

console.log(delivery(0.5));
console.log(delivery(20));
console.log(delivery(300));
```

**Output**

```text
letter
parcel
freight
```

**Rule:** A `case` can hold any expression. `switch (true)` runs the first case whose expression gives `true`. `return` leaves the function, so no `break` is needed after it.

The cases are evaluated from the top, and only until one matches.

`case "abc":` does not match in `switch (true)`. A truthy value is not enough: the value must be `true` itself.

**Common mistake:** testing a range inside `switch (weight)`.

**Wrong**

```js
function delivery(weight) {
  switch («weight») {
    case weight <= 1:
      return "letter";
    default:
      return "freight";
  }
}

console.log(delivery(0.5));
```

**Output**

```text
freight
```

**Fix**

```js
function delivery(weight) {
  switch («true») {
    case weight <= 1:
      return "letter";
    default:
      return "freight";
  }
}

console.log(delivery(0.5));
```

**Output**

```text
letter
```

`weight <= 1` gives `true`, and `0.5 === true` is false, so no case matched. With `switch (true)`, the case that gives `true` is the match.

<!-- task -->

## Remember

- `switch` compares with `===`. `"1"` does not match `1`.
- It runs from the matching `case` until a `break` or a `return`. Without one, it falls through.
- `default` is used when no `case` matches, wherever it stands.
- `switch (true)` runs the first case that gives exactly `true`.
