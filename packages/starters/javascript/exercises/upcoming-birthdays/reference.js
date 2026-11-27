const nextBirthday = (birthday, today) => {
  const born = Temporal.PlainDate.from(birthday);
  const thisYear = born.with({ year: today.year });

  if (Temporal.PlainDate.compare(thisYear, today) >= 0) {
    return thisYear;
  }

  return born.with({ year: today.year + 1 });
};

export function upcomingBirthdays(people, today) {
  const day = Temporal.PlainDate.from(today);

  return people
    .map((person) => ({ name: person.name, next: nextBirthday(person.birthday, day) }))
    .toSorted((a, b) => Temporal.PlainDate.compare(a.next, b.next))
    .map((person) => person.name);
}
