export function collectTeamSkills(teams) {
  return teams
    .filter((team) => team.active)
    .flatMap((team) => team.members)
    .flatMap((member) => member.skills ?? []);
}
