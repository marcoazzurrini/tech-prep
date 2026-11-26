`requestOptions(defaults, options)` should return a new object: the defaults, with each value in `options` replacing the default of the same name.

The code below gives the right values, but it changes `defaults`. Fix it.

Example 1: requestOptions({ method: "GET", retries: 3 }, { retries: 0 })  ->  { method: "GET", retries: 0 }
Example 2:
  const defaults = { method: "GET" };
  requestOptions(defaults, { method: "POST" });
  defaults.method  ->  "GET"
