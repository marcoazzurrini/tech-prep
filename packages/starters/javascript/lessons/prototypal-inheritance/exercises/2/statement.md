Write `linkConstructors(Child, Parent)`. It links `Child.prototype` to `Parent.prototype` so `new Child()` inherits from `Parent.prototype`, without sharing the same prototype object, and sets `Child.prototype.constructor` back to `Child`.

Example 1: linkConstructors(Dog, Animal)  ->  new Dog() instanceof Animal is true and new Dog().constructor === Dog
Example 2: Adding a method to Dog.prototype does not add it to Animal.prototype
