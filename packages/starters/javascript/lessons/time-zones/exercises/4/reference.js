export function kickoffTimes(moment, zones) {
  const kickoff = new Date(moment);
  return zones.map((timeZone) =>
    kickoff.toLocaleTimeString("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }),
  );
}
