Write `nameTags(person, others)`.

`person` has a method `tag()` that reads `this`. `others` is an array of objects with no `tag` method. Return an array with what `person`'s method gives for each object in `others`.

Do not add a property to any object.

Example 1:
  const ada = { name: "Ada", tag() { return "#" + this.name; } };
  nameTags(ada, [{ name: "Bo" }, { name: "Cy" }])  ->  ["#Bo", "#Cy"]
