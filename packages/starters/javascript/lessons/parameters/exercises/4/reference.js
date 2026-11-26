export function tableBooking({ guests = 2, time = "19:00" } = {}) {
  return `Table for ${guests} at ${time}`;
}
