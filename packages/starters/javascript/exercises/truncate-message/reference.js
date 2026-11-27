const character = /\p{RGI_Emoji}|./gsv;

export function truncateMessage(text, max) {
  const characters = text.match(character) ?? [];

  if (characters.length <= max) {
    return text;
  }

  return characters.slice(0, max).join("") + "…";
}
