# Method Chaining

## Return this

**Code**

```js
const basket = {
  items: [],
  add(item) {
    this.items.push(item);

    return this;
  },
  removeLast() {
    this.items.pop();

    return this;
  },
};

basket.add("tea").add("milk").add("salt").removeLast();

console.log(basket.items.join(", "));
```

**Output**

```text
tea, milk
```

**Rule:** A method that ends with `return this` gives back the object it was called on. The next call can start right after it. This is **method chaining**.

`basket.add("tea")` runs first and gives `basket`. So `.add("milk")` is called on `basket` too.

**Common mistake:** forgetting `return this`.

**Wrong**

```js
const basket = {
  items: [],
  add(item) {
    this.items.push(item);
  },
};

basket.add("tea")«.add("milk")»;

console.log(basket.items.join(", "));
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'basket.add("tea").add')
```

**Fix**

```js
const basket = {
  items: [],
  add(item) {
    this.items.push(item);

    «return this;»
  },
};

basket.add("tea").add("milk");

console.log(basket.items.join(", "));
```

**Output**

```text
tea, milk
```

A method with no `return` gives `undefined`. The second `add` was called on `undefined`. `return this` hands the object to the next call.

<!-- task -->

## A value ends it

**Code**

```js
const sentence = {
  words: [],
  add(word) {
    this.words.push(word);

    return this;
  },
  text() {
    return `${this.words.join(" ")}.`;
  },
};

const result = sentence.add("Cats").add("sleep").text();

console.log(result);
console.log(typeof result);
```

**Output**

```text
Cats sleep.
string
```

**Rule:** A chain goes on only while each method returns the object. A method that returns another value, such as `text`, comes last. The whole chain gives what its last method returns.

**Common mistake:** chaining after a method that returns a value.

**Wrong**

```js
const scores = [];

scores.push(4)«.push(9)»;

console.log(scores.length);
```

**Error**

```text
TypeError: scores.push(4).push is not a function. (In 'scores.push(4).push(9)', 'scores.push(4).push' is undefined)
```

**Fix**

```js
const scores = [];

scores.push(4);
«scores.push(9);»

console.log(scores.length);
```

**Output**

```text
2
```

`push` returns the new length of the array, not the array. So the second `push` was called on the number `1`.

<!-- task -->

## One object, every step

**Code**

```js
function createPrice(amount) {
  return {
    amount,
    add(extra) {
      this.amount += extra;

      return this;
    },
  };
}

const base = createPrice(10);
const withTax = base.add(2);
const withTip = withTax.add(3);

console.log(withTip === base);
console.log(base.amount);
```

**Output**

```text
true
15
```

**Rule:** `return this` makes no new object. Every step of the chain is the same object, changed in place. A name for a step in the middle is one more name for that object.

`" ada ".trim().toUpperCase()` gives `"ADA"`. String methods chain in another way: each one returns a new string.

<!-- task -->

## Remember

- A method that ends with `return this` can be chained: `basket.add("tea").add("milk")`.
- A method with no `return` gives `undefined`, and the chain breaks there.
- A method that returns another value ends the chain. Put it last.
- Every step is the same object. `return this` makes no copy.
