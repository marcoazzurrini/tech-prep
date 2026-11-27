# Store Subscriptions (medium)

Write `createStore(initial)`. It holds an app's state, which starts as the object `initial`, and returns an object with three methods.

- `getState()` returns the current state.
- `setState(patch)` makes a new state with the keys of `patch` laid over the old one. Then it calls each subscriber with the new state and the old state, in the order they subscribed.
- `subscribe(fn)` adds a subscriber and returns a function that removes it. Calling that function twice does no harm.

A subscriber may remove itself, or another one, while it is being called. The others still get this change.

Example 1:
  const store = createStore({ count: 0 });
  store.subscribe((next, prev) => console.log(prev.count, next.count));
  store.setState({ count: 1 });  // prints "0 1"
  store.getState()  ->  { count: 1 }
