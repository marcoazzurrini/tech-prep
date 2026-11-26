export function translate(dictionary, language, key) {
  return dictionary[language]?.[key] ?? dictionary.en?.[key] ?? key;
}
