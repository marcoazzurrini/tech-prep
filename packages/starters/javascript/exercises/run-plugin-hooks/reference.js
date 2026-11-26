export function runHooks(plugins, event) {
  return plugins.map((plugin) => plugin?.hooks?.[event]?.() ?? "skipped");
}
