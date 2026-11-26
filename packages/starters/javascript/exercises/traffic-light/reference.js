const order = ["red", "green", "amber"];

export let colour = "red";
export let changes = 0;

export function next() {
  colour = order[(order.indexOf(colour) + 1) % order.length];
  changes += 1;
}

export function reset() {
  colour = "red";
  changes = 0;
}
