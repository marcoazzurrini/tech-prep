export function safeStringify(value) {
  const seen = [];
  return JSON.stringify(value, (key, val) => {
    if (typeof val === "bigint") return String(val);
    if (val !== null && typeof val === "object") {
      if (seen.includes(val)) return "[Circular]";
      seen.push(val);
    }
    return val;
  });
}
