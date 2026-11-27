const rules = new Intl.PluralRules("pl");
const words = { one: "plik", few: "pliki", many: "plików", other: "pliku" };

export function polishFiles(n) {
  return `${n} ${words[rules.select(n)]}`;
}
