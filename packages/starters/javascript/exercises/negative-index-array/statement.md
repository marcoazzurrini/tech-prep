# Negative Index Array (medium)

Write `withNegativeIndex(array)`. It returns a view of `array` that also takes negative indexes: `-1` is the last item, `-2` the one before, and so on.

Reading and assigning both work, and an assignment changes `array`. A negative index past the start reads as `undefined`. Everything else, such as `length` and the array methods, works as usual.

Example 1: withNegativeIndex([1, 2, 3])[-1]  ->  3
Example 2: withNegativeIndex([1, 2, 3])[-3]  ->  1
Example 3: withNegativeIndex(["x"])[-2]  ->  undefined
