export function run(task) {
  const generator = task();
  let result = generator.next();

  while (!result.done) {
    let answer;

    try {
      answer = result.value();
    } catch (error) {
      result = generator.throw(error);
      continue;
    }

    result = generator.next(answer);
  }

  return result.value;
}
