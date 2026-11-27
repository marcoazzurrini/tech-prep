const settings = { theme: "dark", language: "en", size: "large" };

function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function loadSetting(name) {
  return later(name, 10).then((key) => {
    if (key === "password") {
      throw new Error("locked");
    }
    if (!(key in settings)) {
      throw new Error("missing");
    }
    return settings[key];
  });
}

export function readSetting(name) {
  return loadSetting(name).catch((error) => {
    if (error.message === "missing") {
      return "off";
    }
    throw error;
  });
}
