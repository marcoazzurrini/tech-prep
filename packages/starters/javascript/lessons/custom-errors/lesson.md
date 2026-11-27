# Custom Errors

## Extend Error

**Code**

```js
class StockError extends Error {
  constructor(item, left) {
    super(`Only ${left} ${item} left`);
    this.name = "StockError";
    this.item = item;
    this.left = left;
  }
}

try {
  throw new StockError("mugs", 2);
} catch (error) {
  console.log(String(error));
  console.log(error.item, error.left);
  console.log(error instanceof StockError, error instanceof Error);
}
```

**Output**

```text
StockError: Only 2 mugs left
mugs 2
true true
```

**Rule:** `class StockError extends Error` makes your own kind of error. Pass the message to `super()`, set `this.name` to the class name, and add the fields a handler needs.

`name = "StockError";` as a class field works too. Fields are set right after `super()` returns.

**Common mistake:** leaving out `this.name`.

**Wrong**

```js
class StockError extends Error {
  constructor(item, left) {
    super(`Only ${left} ${item} left`);
    this.item = item;
  }
}

try {
  throw new StockError("mugs", 2);
} catch (error) {
  console.log(error.name);
}
```

**Output**

```text
Error
```

**Fix**

```js
class StockError extends Error {
  constructor(item, left) {
    super(`Only ${left} ${item} left`);
    «this.name = "StockError";»
    this.item = item;
  }
}

try {
  throw new StockError("mugs", 2);
} catch (error) {
  console.log(error.name);
}
```

`name` is inherited from `Error.prototype`, where it is `"Error"`. Without its own `name`, the error looks like a plain `Error` in every log.

<!-- task -->

## A family of errors

**Code**

```js
class PaymentError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CardDeclinedError extends PaymentError {}
class CardExpiredError extends PaymentError {}

const error = new CardExpiredError("Card expired in May");

console.log(error.name);
console.log(error instanceof CardExpiredError);
console.log(error instanceof PaymentError);
console.log(error instanceof CardDeclinedError);
```

**Output**

```text
CardExpiredError
true
true
false
```

**Rule:** Error classes can form a family, with one parent class and several children. `instanceof PaymentError` matches the whole family. `instanceof CardExpiredError` matches one member.

`this.name = this.constructor.name` gives every child the right `name`. `this.constructor` is the class that `new` was called on.

**Common mistake:** testing for the parent first.

**Wrong**

```js
class PaymentError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CardExpiredError extends PaymentError {}

function advice(error) {
  if («error instanceof PaymentError») {
    return "Try again later";
  }
  if («error instanceof CardExpiredError») {
    return "Update your card";
  }
  return "Contact support";
}

console.log(advice(new CardExpiredError("Card expired in May")));
```

**Output**

```text
Try again later
```

**Fix**

```js
class PaymentError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CardExpiredError extends PaymentError {}

function advice(error) {
  if («error instanceof CardExpiredError») {
    return "Update your card";
  }
  if («error instanceof PaymentError») {
    return "Try again later";
  }
  return "Contact support";
}

console.log(advice(new CardExpiredError("Card expired in May")));
```

A `CardExpiredError` is also a `PaymentError`, so the first test took it. Test the most specific class first.

<!-- task -->

## Keep the cause

**Code**

```js
class ConfigError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ConfigError";
  }
}

function readConfig(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ConfigError("Config is not valid JSON", { cause: error });
  }
}

try {
  readConfig("{port: 80}");
} catch (error) {
  console.log(String(error));
  console.log(error.cause.name);
}
```

**Output**

```text
ConfigError: Config is not valid JSON
SyntaxError
```

**Rule:** To **wrap** an error is to catch it and throw your own error in its place. Pass `{ cause: error }` when you do. The caller gets one clear class, and the original error is kept in `cause`.

`super(message, options)` passes the options on to `Error`. That is where `cause` is stored.

**Common mistake:** a constructor that drops the options.

**Wrong**

```js
class ConfigError extends Error {
  «constructor(message) {»
    «super(message);»
    this.name = "ConfigError";
  }
}

try {
  JSON.parse("{port: 80}");
} catch (error) {
  const wrapped = new ConfigError("Config is not valid JSON", { cause: error });
  console.log(wrapped.cause);
}
```

**Output**

```text
undefined
```

**Fix**

```js
class ConfigError extends Error {
  «constructor(message, options) {»
    «super(message, options);»
    this.name = "ConfigError";
  }
}

try {
  JSON.parse("{port: 80}");
} catch (error) {
  const wrapped = new ConfigError("Config is not valid JSON", { cause: error });
  console.log(wrapped.cause.name);
}
```

The constructor ignored its second argument, so `Error` never saw `cause`. Take the options and hand them to `super`.

<!-- task -->

## Rethrow the rest

**Code**

```js
class NotFoundError extends Error {
  constructor(item) {
    super(`No price for ${item}`);
    this.name = "NotFoundError";
  }
}

const prices = { tea: 3, cake: "4" };

function priceOf(item) {
  if (!Object.hasOwn(prices, item)) {
    throw new NotFoundError(item);
  }
  return prices[item];
}

function priceLabel(item) {
  try {
    return "£" + priceOf(item).toFixed(2);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return "not sold here";
    }
    throw error;
  }
}

console.log(priceLabel("tea"));
console.log(priceLabel("soup"));

try {
  priceLabel("cake");
} catch (error) {
  console.log("rethrown: " + error.name);
}
```

**Output**

```text
£3.00
not sold here
rethrown: TypeError
```

**Rule:** A `catch` should handle only the error classes it knows, and rethrow the rest with `throw error`. Your own class makes the test exact: `instanceof NotFoundError` matches nothing else.

The price of cake is a string, so `toFixed` is not a function. That bug is a `TypeError`, and it reaches the caller.

<!-- task -->

## Remember

- `class MyError extends Error`: call `super(message, options)`, set `this.name`, add fields.
- A child of your error class is also an instance of its parent. Test the most specific class first.
- Wrap a low-level error with `{ cause: error }`, so the original is kept.
- Handle the classes you know, and rethrow every other error.
