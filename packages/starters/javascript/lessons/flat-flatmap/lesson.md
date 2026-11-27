# flat and flatMap

## Flattening with flat

**Code**

```js
const nested = [1, [2, 3], [[4, 5]]];

console.log(JSON.stringify(nested.flat()));
console.log(JSON.stringify(nested.flat(2)));
console.log(JSON.stringify(nested.flat(Infinity)));
console.log(JSON.stringify([1, , 3].flat()));
```

**Output**

```text
[1,2,3,[4,5]]
[1,2,3,4,5]
[1,2,3,4,5]
[1,3]
```

**Rule:** `flat(depth)` returns a new array with nested arrays unwrapped up to `depth` levels. The default `depth` is `1`.

`flat` removes holes at every level it flattens. It leaves the original array untouched.

`flat(Infinity)` unwraps every level, no matter how deeply nested.

**Common mistake:** expecting `flat()` with no argument to flatten every level.

**Wrong**

```js
const tree = [1, [2, [3, [4]]]];

console.log(JSON.stringify(tree.flat()));
```

**Output**

```text
[1,2,[3,[4]]]
```

**Fix**

```js
const tree = [1, [2, [3, [4]]]];

console.log(JSON.stringify(tree.flat(«Infinity»)));
```

With no argument, `flat()` removes only one level of nesting. Pass `Infinity` when the nesting depth is not fixed.

<!-- task -->

## Mapping with flatMap

**Code**

```js
const orders = [
  { id: 1, items: ["tea", "cake"] },
  { id: 2, items: [] },
  { id: 3, items: ["soup"] },
];

const allItems = orders.flatMap((order) => order.items);
console.log(allItems.join(", "));

const doubles = [2, -1, 3].flatMap((n) => (n > 0 ? [n, n * 10] : []));
console.log(doubles.join(", "));
```

**Output**

```text
tea, cake, soup
2, 20, 3, 30
```

**Rule:** `flatMap(fn)` runs `fn` on each item and flattens the result by one level. It works like `map(fn).flat(1)`.

Returning `[]` drops the item, so `flatMap` can filter and expand in one pass.

Returning a non-array value keeps that value as one item in the output.

**Common mistake:** expecting `flatMap` to flatten more than one level.

**Wrong**

```js
const groups = [
  { tags: [["js", "ts"]] },
  { tags: [["css"]] },
];

const list = groups.flatMap((group) => group.tags);
console.log(JSON.stringify(list));
```

**Output**

```text
[["js","ts"],["css"]]
```

**Fix**

```js
const groups = [
  { tags: [["js", "ts"]] },
  { tags: [["css"]] },
];

const list = groups.flatMap((group) => group.tags«.flat()»);
console.log(JSON.stringify(list));
```

`flatMap` always flattens by depth `1`, never deeper. Flatten inner arrays yourself, or call `.flat()` on the result.

<!-- task -->

## Remember

- `flat(depth)` returns a new array and defaults to depth `1`. Pass `Infinity` to unwrap all levels.
- `flat` removes holes at the levels it flattens.
- `flatMap(fn)` maps each item and flattens by one level only.
- Return `[]` from `flatMap` to drop an item, or an array of many items to expand it.
