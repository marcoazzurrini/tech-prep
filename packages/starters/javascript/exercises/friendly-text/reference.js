const show = (value) => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
};

export function text(strings, ...values) {
  let out = strings[0];

  values.forEach((value, i) => {
    out += show(value) + strings[i + 1];
  });

  return out;
}
