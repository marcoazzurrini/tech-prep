export function removeGuest(guests, name) {
  const wasThere = Object.hasOwn(guests, name);

  delete guests[name];

  return wasThere;
}
