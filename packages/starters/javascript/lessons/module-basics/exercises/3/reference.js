const KM_PER_MILE = 1.6;

function toKm(miles) {
  return miles * KM_PER_MILE;
}

function toMiles(km) {
  return km / KM_PER_MILE;
}

export { toKm, toMiles };
