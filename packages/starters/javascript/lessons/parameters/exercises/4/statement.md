Write `tableBooking(options)`. `options` is an object that may hold `guests` and `time`. It returns a line such as `"Table for 4 at 20:30"`.

When `guests` is missing, use `2`. When `time` is missing, use `"19:00"`. The function may also be called with no argument.

Example 1: tableBooking({ guests: 4, time: "20:30" })  ->  "Table for 4 at 20:30"
Example 2: tableBooking({ guests: 6 })  ->  "Table for 6 at 19:00"
Example 3: tableBooking()  ->  "Table for 2 at 19:00"
