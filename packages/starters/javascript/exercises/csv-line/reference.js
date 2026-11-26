const cell = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  return text.includes(",") ? `"${text}"` : text;
};

export function csvLine(values) {
  return values.map(cell).join(",");
}
