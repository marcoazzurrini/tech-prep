# Canonical Keys

Some items look different but belong together. Give each item a key that is the same for every item of its group. Then keep a map from the key to the list of items with that key.

## Worked example

Group words by their first letter. The first letter is the key.

```ts
const groups = new Map<string, string[]>();

for (const word of ["apple", "avocado", "banana"]) {
  const key = word[0];
  const group = groups.get(key) ?? [];
  group.push(word);
  groups.set(key, group);
}

// groups: "a" has apple and avocado, "b" has banana
```

## Why it works

- Items with the same key land in the same list, in one pass over the input.
- `?? []` starts a new list the first time a key appears.
- `groups.set` stores the list back. A new list is not in the map until you set it.

## When to use it

- The task says "group", or asks which items are equivalent.
- You can describe what the items of a group share. That description becomes the key.
- A key must be a string or a number. Join an array into a string before you use it as a key.
