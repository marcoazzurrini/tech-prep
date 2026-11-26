# Recipe Steps (easy)

`makeSteps(names)` takes the names of the steps of a recipe. It should return an array with one function for each name. The function at index `k` returns the number of the step and its name.

The code below makes every function return the same text. Fix it.

Example 1:
  const steps = makeSteps(["wash", "chop", "fry"]);
  steps[0]()  ->  "1. wash"
  steps[2]()  ->  "3. fry"
