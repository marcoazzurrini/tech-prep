const isWeekend = (day) => day === "sat" || day === "sun";

const discount = (age, price) => {
  if (age < 12) {
    return price / 2;
  }

  return age >= 65 ? price - 3 : price;
};

export function ticketPrice(age, day) {
  return discount(age, isWeekend(day) ? 12 : 10);
}
