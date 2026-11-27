`cache` is a `Map` from a key to a `WeakRef`. A cleanup callback calls `forgetIfGone(cache, key)`, maybe long after the old value was collected. By then a new value may be stored under the same key.

It should delete the entry only when its value is gone, and return `true` when it deleted something. The code below always deletes. Fix it.

The tests stand in for a collected value with `{ deref: () => undefined }`.

Example 1:
  cache = new Map([["a", { deref: () => undefined }]])
  forgetIfGone(cache, "a")  ->  true, and the entry is deleted

Example 2:
  cache = new Map([["a", new WeakRef(report)]])
  forgetIfGone(cache, "a")  ->  false, and the entry stays

Example 3: forgetIfGone(new Map(), "z")  ->  false
