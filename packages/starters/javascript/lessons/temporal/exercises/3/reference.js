export function ageOn(birthday, day) {
  const born = Temporal.PlainDate.from(birthday);
  return born.until(Temporal.PlainDate.from(day), { largestUnit: "years" }).years;
}
