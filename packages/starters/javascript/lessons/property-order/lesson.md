# Property Order

## Whole numbers come first

**Code**

```js
const shelf = { tea: 1, 20: "b", milk: 2, 3: "a" };

console.log(Object.keys(shelf).join(", "));
console.log(JSON.stringify(shelf));
```

**Output**

```text
3, 20, tea, milk
{"3":"a","20":"b","tea":1,"milk":2}
```

**Rule:** An object lists its keys in a fixed order: keys that look like whole numbers first, in rising order. Then come the other string keys, in the order they were added.

`Object.keys(shelf)` gives the keys of an object as an array of strings. `JSON.stringify` and loops list the keys in the same order.

`{ [Symbol("id")]: 1, a: 2 }` lists `a` before the symbol. Symbol keys come last, and `Object.keys` leaves them out.

**Common mistake:** keeping an order in an object with number keys.

**Wrong**

```js
const finishers = «{ 205: "Ada", 17: "Bo", 88: "Kai" }»;

console.log(JSON.stringify(finishers));
```

**Output**

```text
{"17":"Bo","88":"Kai","205":"Ada"}
```

**Fix**

```js
const finishers = «[[205, "Ada"], [17, "Bo"], [88, "Kai"]]»;

console.log(JSON.stringify(finishers));
```

Ada finished first, with bib number 205. The object sorted the bib numbers, so the finishing order is gone. An array of pairs keeps the order you give it. So does a `Map`, which a later lesson covers.

<!-- task -->

## Which keys count

**Code**

```js
const marks = { "07": "a", 7: "b", "-1": "c", 1.5: "d", 0: "e" };

console.log(Object.keys(marks).join(", "));
```

**Output**

```text
0, 7, 07, -1, 1.5
```

**Rule:** A key counts as a whole number only when it reads exactly as JavaScript prints a whole number from zero up: `"0"`, `"7"`, `"42"`. A leading zero, a minus sign or a decimal point makes it an ordinary string key.

`{ 7.0: "x" }` has the key `"7"`, because a number key is converted to a string first. `{ "7.0": "x" }` keeps the ordinary string key `"7.0"`.

`4294967295` is too large to count. The whole numbers stop at 4294967294, and a larger one is an ordinary string key.

<!-- task -->

## Changing keeps the place

**Code**

```js
const recipe = { wash: 1, chop: 2, cook: 3 };

recipe.wash = 10;
console.log(Object.keys(recipe).join(", "));

delete recipe.chop;
recipe.chop = 2;
console.log(Object.keys(recipe).join(", "));
```

**Output**

```text
wash, chop, cook
wash, cook, chop
```

**Rule:** Assigning to a key that is already there keeps its place. A key that is deleted and added again is a new key: it goes to the end.

`{ a: 1, b: 2, a: 3 }` lists `a` first, with the value `3`. A repeated key keeps its first place and its last value.

`delete obj[5]` followed by `obj[5] = 1` does not move the key `5`. Whole number keys are always sorted.

<!-- task -->

## Remember

- Keys that look like whole numbers come first, in rising order.
- Then the other string keys, in the order they were added. Then symbols.
- `"07"`, `"-1"` and `"1.5"` are ordinary string keys.
- An object with number keys cannot keep your order. Use an array of pairs.
