function bake(dish, onDone, onBurnt) {
  setTimeout(() => {
    if (dish === "toast") {
      onBurnt(new Error("toast burnt"));
    } else {
      onDone(dish + " baked");
    }
  }, 5);
}

export function bakeAsync(dish) {
  return new Promise((resolve, reject) => {
    bake(dish, resolve, reject);
  });
}
