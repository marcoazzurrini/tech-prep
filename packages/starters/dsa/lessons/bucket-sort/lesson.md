# Bucket Sort by Count

A count over `n` items is never larger than `n`. So you can use a count as an index into an array of buckets. Put each value in the bucket for its count. Then read the buckets in order. This ranks the values in O(n), with no call to `sort`.

## Worked example

Rank the letters of a word from most common to least common.

```ts
const word = "banana";
const counts = new Map<string, number>();
for (const letter of word) {
  counts.set(letter, (counts.get(letter) ?? 0) + 1);
}

const buckets: string[][] = [];
for (let i = 0; i <= word.length; i++) buckets.push([]);
for (const [letter, count] of counts) buckets[count].push(letter);

const ranked: string[] = [];
for (let count = word.length; count >= 1; count--) {
  ranked.push(...buckets[count]);
}

// ranked: ["a", "n", "b"]
```

## Why it works

- `buckets[count]` holds every letter with that count. Letters with equal counts share a bucket.
- There are `word.length + 1` buckets, because a count can be any number from 0 to `word.length`.
- The last loop reads from the highest index down. So the most common letters come first.

## When to use it

- The task says "most frequent" or "top k", and asks for better than O(n log n).
- The numbers to rank are small whole numbers with a known upper limit, such as counts or scores.
- The limit is about the size of the input. A huge limit would need too many buckets.
