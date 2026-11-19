# Several Outputs with ,

`a, b` gives the outputs of `a`, then the outputs of `b`. Both filters run on the same input. Use it to read several things from one input.

## Worked example

Give the host of a server, then its port.

**Input**

```json
{
  "host": "db1",
  "port": 5432,
  "tls": true
}
```

**Filter**

```jq
.host, .port
```

**Output**

```json
"db1"
5432
```

## Why it works

- `.host` runs on the input and gives `"db1"`.
- `.port` runs on the same input and gives `5432`.
- The comma keeps the order: the left side first, then the right side.

## When to use it

- The task says "the name and the email", "then" or "both". You need several values from one input.
- You want the values in one array. Put the commas inside `[ ]`: `[.host, .port]`.
- You get the error `Cannot index string with string "port"`. You wrote `.host | .port`. The pipe passes the host on. The comma keeps the input.
