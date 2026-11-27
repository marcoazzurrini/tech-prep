Write the class `Radio`. It has two methods.

- `on(channel, listener)` adds a listener to a channel.
- `emit(channel, ...args)` calls each listener of the channel with the arguments, in the order they were added. It returns how many listeners it called.

Example 1:
  const radio = new Radio();
  radio.on("news", (title) => console.log(title));
  radio.emit("news", "Rain")  ->  1
  radio.emit("sport")  ->  0
