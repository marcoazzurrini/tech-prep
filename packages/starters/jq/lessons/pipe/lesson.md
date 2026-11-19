# Chain Filters with |

`a | b` runs `a` first. Then it runs `b` on what `a` gave. This way you build a long filter from small steps.

## Worked example

Give the city that the parcel goes to.

**Input**

```json
{
  "id": 81,
  "to": {
    "name": "Lena",
    "address": {"city": "Porto", "zip": "4000"}
  }
}
```

**Filter**

```jq
.to | .address | .city
```

**Output**

```json
"Porto"
```

## Why it works

- `.to` gives the inner object. The `|` hands it to the next step.
- In the next step, `.` is that inner object, not the whole input. So `.address` finds the address.
- A step can also be a function with a name. `.to | .address | .city | ascii_upcase` gives `"PORTO"`.

## When to use it

- The task has steps: "take the last order, then read its total". Write one small filter for each step.
- You want to run a function on one part of the input: write the path, then `|`, then the function.
- You get an error such as `explode input must be a string`: the function ran on the whole input. Put the path and a `|` before it.
