# Import Records (medium)

Write `importAll(ids, load, save)`. `load(id)` returns a promise of a record, and `save(record)` returns a promise of a receipt.

Each record must be loaded before it is saved. The ids do not depend on each other: start loading every id at once, and save each record as soon as it has loaded.

Return a promise of the receipts, in the order of `ids`. If a step rejects, reject with its error.

Example 1: importAll([1, 2], async (id) => id * 10, async (record) => record + 1)  ->  [11, 21]
Example 2: importAll([], load, save)  ->  []
