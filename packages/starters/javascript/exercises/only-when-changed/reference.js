export function whenChanged(fn) {
  let called = false;
  let last;

  return (value) => {
    if (called && value === last) {
      return false;
    }

    called = true;
    last = value;
    fn(value);

    return true;
  };
}
