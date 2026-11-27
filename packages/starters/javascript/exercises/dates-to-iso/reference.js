const date = /\b(\d{2})\/(\d{2})\/(\d{4})\b/g;

export function toIsoDates(text) {
  return text.replace(date, (match, day, month, year) => {
    const validDay = day >= 1 && day <= 31;
    const validMonth = month >= 1 && month <= 12;

    return validDay && validMonth ? `${year}-${month}-${day}` : match;
  });
}
