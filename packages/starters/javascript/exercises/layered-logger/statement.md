# Layered Logger (medium)

Write constructor functions `Logger(prefix)` and `TaggedLogger(prefix, tag)`.

- `Logger(prefix)` sets `this.prefix = prefix` and `this.entries = []`. Its `record(msg)` method appends `this.prefix + ": " + msg` to `this.entries` and returns `this` so calls can be chained.
- `TaggedLogger(prefix, tag)` sets the same own properties plus `this.tag = tag`. An instance of `TaggedLogger` must pass `instanceof Logger` and `instanceof TaggedLogger`, and have `constructor === TaggedLogger`. Its `record(msg)` method appends `this.prefix + ": [" + this.tag + "] " + msg` to `this.entries` and returns `this`.

Example 1: new Logger("APP").record("start").record("done").entries  ->  ["APP: start", "APP: done"]
Example 2: new TaggedLogger("APP", "DB").record("open").entries  ->  ["APP: [DB] open"]

Note: Solve it without `class`.
