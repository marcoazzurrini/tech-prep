# Go Deeper with a Path

Real JSON has objects inside objects. To reach a value inside, you walk down one step at a time.

## One step after another

Join the steps with dots:

**Input**

```json
{"name": "Ada", "address": {"city": "Oslo", "zip": "0150"}}
```

**Filter**

```jq
.address.city
```

**Output**

```json
"Oslo"
```

Read it from left to right:

- `.address` takes the inner object: `{"city": "Oslo", "zip": "0150"}`.
- `.city` then takes `city` from that inner object.

A filter like this is called a **path**. It can be as long as the data is deep: `.a.b.c`.

<!-- task -->

## Build a path step by step

You do not have to write a long path in one go. Write the first step and look at the output. Then add the next step.

Say you want a customer's email from an order:

- `.order` shows the whole order. You see that it has a `customer`.
- `.order.customer` shows the customer. You see that it has an `email`.
- `.order.customer.email` is the value you want.

The output panel is your map. Read it after every step.

<!-- task -->

## When a step fails

Two things can go wrong.

**A key is missing.** As before, you get `null`. Every step after it gives `null` too.

```jq
.user.address.city
```

On the input `{"user": {"name": "Ada"}}` this prints `null`, because the user has no `address`.

**You go one step too far.** A string or a number has nothing inside it. Ask it for a key, and jq stops with an error:

```jq
.user.name.first
```

```text
jq: error: Cannot index string with string "first"
```

Read the error like this: "the value here is a string, and I cannot take `first` from a string". To fix it, remove the last step, or look at what the step before it gives.

<!-- task -->

## Remember

- A path joins steps with dots: `.a.b.c`.
- Each step works on what the step before gave.
- Build a path one step at a time, and read the output after each step.
- A missing key gives `null` for the rest of the path.
- `Cannot index string with string "x"` means you went one step too far.
