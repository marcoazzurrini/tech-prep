function repeat(times, action) {
  for (let i = 0; i < times; i += 1) {
    action();
  }
}

export function drain(tank, times) {
  repeat(times, () => tank.open());

  return tank.litres;
}
