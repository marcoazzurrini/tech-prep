# Form Checks (easy)

Write `runChecks(checks, form, limits)`.

`checks` is an array of functions. Each check reads the form from `this`, takes some limits as its arguments, and returns an error text or `null`. `limits` is an array with those arguments.

Run every check on `form` with the limits. Return the error texts, in order, without the `null` results. Do not add a property to `form`.

Example 1:
  function longEnough(min) { return this.name.length >= min ? null : "name too short"; }
  function notTooLong(min, max) { return this.name.length <= max ? null : "name too long"; }
  runChecks([longEnough, notTooLong], { name: "Al" }, [3, 8])  ->  ["name too short"]
