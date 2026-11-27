# Message Channel (hard)

Write `createChannel()`. It returns a channel that one part of a program writes to and another part reads from, with `for await (const value of channel)`.

- `channel.push(value)` sends a value.
- `channel.close()` says that no more values will come. A `push` after `close` is ignored.

A reader gets every value in the order it was pushed, also the values pushed before it started reading. When no value is waiting, the reader waits for the next `push`. The loop ends once the channel is closed and every value has been read.

Example 1:
  const channel = createChannel();
  channel.push(1); channel.push(2); channel.close();
  Array.fromAsync(channel)  ->  fulfils with [1, 2]
Example 2: next() on an empty channel, then push(5)  ->  next() fulfils with { value: 5, done: false }
