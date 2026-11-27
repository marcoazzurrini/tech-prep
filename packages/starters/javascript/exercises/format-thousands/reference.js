export function formatThousands(n) {
  const [whole, fraction] = String(Math.abs(n)).split(".");
  const groups = [];

  for (let end = whole.length; end > 0; end -= 3) {
    groups.unshift(whole.slice(Math.max(0, end - 3), end));
  }

  const sign = n < 0 ? "-" : "";
  const tail = fraction === undefined ? "" : "." + fraction;

  return sign + groups.join(",") + tail;
}
