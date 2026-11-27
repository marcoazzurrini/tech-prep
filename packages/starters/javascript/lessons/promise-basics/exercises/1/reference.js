export function checkAge(age) {
  return new Promise((resolve, reject) => {
    if (age >= 18) {
      resolve("welcome");
    } else {
      reject(new Error("too young"));
    }
  });
}
