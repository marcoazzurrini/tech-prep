# Query Text (medium)

Write `createQuery(table)`. It returns an object that builds the text of a database query, with these methods:

- `where(condition)` adds a condition.
- `orderBy(column)` sets the column to sort by.
- `limit(count)` sets the largest number of rows.
- `toString()` returns the text.

The first three can be called in any order, one after another, as in the examples.

The text always has its parts in this order: `SELECT * FROM` and the table, then `WHERE` and the conditions joined with `AND`, then `ORDER BY` and the column, then `LIMIT` and the count. A part that was never set is left out.

Example 1: createQuery("pets").toString()  ->  "SELECT * FROM pets"
Example 2: createQuery("pets").limit(5).where("age > 2").toString()  ->  "SELECT * FROM pets WHERE age > 2 LIMIT 5"
Example 3:
  createQuery("pets").where("age > 2").where("legs = 4").orderBy("name").toString()
  ->  "SELECT * FROM pets WHERE age > 2 AND legs = 4 ORDER BY name"

Note: a second `orderBy` or `limit` replaces the first.
