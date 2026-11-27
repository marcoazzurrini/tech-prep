# Add Shared Methods (medium)

Write `addMethods(Constructor, methods)`. `methods` is an object of functions. After the call, every object made with `new Constructor()` can call each of them, including objects made before the call.

The objects share the functions: they are not own properties of each object. `constructor` still points at `Constructor` and stays out of `for...in`. Return `Constructor`.

Example 1:
  function Dog(name) { this.name = name; }
  addMethods(Dog, { bark() { return this.name + " barks"; } });
  new Dog("Rex").bark()  ->  "Rex barks"
Example 2: Object.keys(new Dog("Rex"))  ->  ["name"]
