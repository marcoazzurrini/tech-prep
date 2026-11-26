`createTagger(tag)` should return an object with a `tag` and a method `tagAll(words)`. The method returns each word with the object's `tag` in front.

The code below throws, because the callback gets a `this` of its own. Fix it.

Example 1: createTagger("#").tagAll(["js", "css"])  ->  ["#js", "#css"]
