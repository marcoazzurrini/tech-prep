export function cookLater(dish, ms) {
  return new Promise((resolve, reject) => {
    if (dish === "") {
      reject(new Error("no dish"));
      return;
    }

    setTimeout(resolve, ms, dish + " is ready");
  });
}
