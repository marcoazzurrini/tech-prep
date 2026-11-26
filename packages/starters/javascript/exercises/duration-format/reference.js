function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return `${minutes}:${rest}`;
}

function parseDuration(text) {
  const [minutes, seconds] = text.split(":").map(Number);

  return minutes * 60 + seconds;
}

export default formatDuration;
export { parseDuration, parseDuration as toSeconds };
