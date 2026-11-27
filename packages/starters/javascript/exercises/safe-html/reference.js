const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const render = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(render).join("");
  }

  return escape(value);
};

export function html(strings, ...values) {
  let out = strings[0];

  values.forEach((value, i) => {
    out += render(value) + strings[i + 1];
  });

  return out;
}
