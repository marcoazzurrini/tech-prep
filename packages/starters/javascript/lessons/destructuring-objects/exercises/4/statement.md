Write `publicProfile(account)`. It returns a new object with every property of `account` except `password` and `token`.

It must not change `account`.

Example 1: publicProfile({ id: 1, name: "Ada", password: "pw", token: "t1" })  ->  { id: 1, name: "Ada" }
Example 2: publicProfile({ id: 2 })  ->  { id: 2 }
