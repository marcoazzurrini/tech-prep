export function volumeLabel(level) {
  if (level === null) {
    return "not set";
  }

  return `volume ${level}`;
}
