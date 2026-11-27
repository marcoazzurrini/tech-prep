# Set Operations

## Combining two sets

**Code**

```js
const morning = new Set(["Ada", "Bo", "Cy"]);
const evening = new Set(["Cy", "Di"]);

console.log([...morning.union(evening)].join(","));
console.log([...morning.intersection(evening)].join(","));
console.log([...morning.difference(evening)].join(","));
console.log([...morning.symmetricDifference(evening)].join(","));
console.log(morning.size, evening.size);
```

**Output**

```text
Ada,Bo,Cy,Di
Cy
Ada,Bo
Ada,Bo,Di
3 2
```

**Rule:** Four methods combine two sets into a new set and leave both sets unchanged. `a.union(b)` holds the values in either set. `a.intersection(b)` holds those in both, `a.difference(b)` those in `a` but not in `b`, and `a.symmetricDifference(b)` those in exactly one.

`a.union(b)` lists the values of `a` first, then the new ones from `b`. `a.intersection(b)` follows the order of `b` when `b` is the smaller set.

**Common mistake:** passing an array as the other set.

**Wrong**

```js
const morning = new Set(["Ada", "Bo"]);

const all = morning.union(«["Cy"]»);
console.log(all.size);
```

**Error**

```text
TypeError: Set operation expects first argument to have non-NaN 'size' property
```

**Fix**

```js
const morning = new Set(["Ada", "Bo"]);

const all = morning.union(«new Set(["Cy"])»);
console.log(all.size);
```

The argument must look like a set: it needs `size`, `has` and `keys`. An array has no `size`, so the call throws a `TypeError`. A `Map` does qualify, and its keys are used.

<!-- task -->

## Comparing two sets

**Code**

```js
const needed = new Set(["flour", "eggs"]);
const pantry = new Set(["flour", "eggs", "milk"]);

console.log(needed.isSubsetOf(pantry));
console.log(pantry.isSupersetOf(needed));
console.log(needed.isDisjointFrom(new Set(["salt"])));
console.log(pantry.isSubsetOf(needed));
console.log(new Set().isSubsetOf(needed));
```

**Output**

```text
true
true
true
false
true
```

**Rule:** `a.isSubsetOf(b)` is `true` when every value of `a` is also in `b`. `a.isSupersetOf(b)` is the same test the other way round. `a.isDisjointFrom(b)` is `true` when the two sets share no value.

The empty set is a subset of every set. Every set is a subset of itself.

**Common mistake:** comparing two sets with `===`.

**Wrong**

```js
const a = new Set([1, 2]);
const b = new Set([2, 1]);

console.log(«a === b»);
```

**Output**

```text
false
```

**Fix**

```js
const a = new Set([1, 2]);
const b = new Set([2, 1]);

console.log(«a.size === b.size && a.isSubsetOf(b)»);
```

`===` compares references, so two different sets are never equal. Two sets hold the same values when their sizes match and one is a subset of the other.

<!-- task -->

## By hand with has

**Code**

```js
const signedUp = ["Ada", "Bo", "Cy", "Di"];
const paid = new Set(["Bo", "Di", "Eve"]);

const both = signedUp.filter((name) => paid.has(name));
const unpaid = signedUp.filter((name) => !paid.has(name));

console.log(both.join(","));
console.log(unpaid.join(","));
```

**Output**

```text
Bo,Di
Ada,Cy
```

**Rule:** `filter` with `has` keeps the values that are in both: an intersection. `filter` with `!has` keeps those missing from the other side: a difference. Put the side you look values up in into a `Set` first.

`paid.has(name)` takes about the same time however large `paid` is. `list.includes(name)` checks the items one by one, so it gets slower as the list grows.

`new Set(both)` turns the result into a set, and drops repeats if the list had any.

**Common mistake:** calling `includes` on a set.

**Wrong**

```js
const signedUp = ["Ada", "Bo"];
const paid = new Set(["Bo"]);

const both = signedUp.filter((name) => paid.«includes»(name));
console.log(both.join(","));
```

**Error**

```text
TypeError: paid.includes is not a function. (In 'paid.includes(name)', 'paid.includes' is undefined)
```

**Fix**

```js
const signedUp = ["Ada", "Bo"];
const paid = new Set(["Bo"]);

const both = signedUp.filter((name) => paid.«has»(name));
console.log(both.join(","));
```

`includes` is an array method. A set answers the same question with `has`.

<!-- task -->

## Remember

- `union`, `intersection`, `difference` and `symmetricDifference` return a new set and change neither input.
- `isSubsetOf`, `isSupersetOf` and `isDisjointFrom` return `true` or `false`. The empty set is a subset of every set.
- The argument must be set-like, with `size`, `has` and `keys`. An array throws a `TypeError`.
- By hand: `filter` with `has` for an intersection, and with `!has` for a difference.
