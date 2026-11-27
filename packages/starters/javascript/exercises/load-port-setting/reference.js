export function loadPort(text) {
  let settings;

  try {
    settings = JSON.parse(text);
  } catch (error) {
    throw new Error("settings are not valid JSON", { cause: error });
  }

  const { port } = settings;

  if (typeof port !== "number") {
    throw new TypeError("port must be a number");
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RangeError("port must be a whole number from 1 to 65535");
  }

  return port;
}
