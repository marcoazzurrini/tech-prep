# Save a Draft (medium)

Write `saveDraft(store, draft)`. It sets `store.saving` to `true`, then calls `store.save(draft)`, which returns a promise. `saveDraft` returns a promise of what `save` gives.

If saving fails with a `ConflictError`, the promise fulfils with `"conflict"`. Any other error rejects the promise, unchanged.

Whatever happens, `store.saving` is `false` by the time the promise settles.

Example 1: a store whose save gives "Notes saved"  ->  "Notes saved"
Example 2: a store whose save rejects with a ConflictError  ->  "conflict"
Example 3: a store whose save rejects with a TypeError  ->  rejects with that TypeError
