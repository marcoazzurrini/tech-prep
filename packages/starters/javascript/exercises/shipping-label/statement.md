# Shipping Label (easy)

Write `shippingLabel(order)`. It returns one line of text for a parcel: the customer's name, the city and the country, joined by `", "`.

`order.customer` holds the `name` and an `address`. The address holds the `city`, and may hold a `country`. With no country, use `"Italy"`.

When `order.express` is `true`, add `" (express)"` at the end.

Example 1: shippingLabel({ customer: { name: "Ada", address: { city: "Turin" } } })  ->  "Ada, Turin, Italy"
Example 2:
  shippingLabel({ express: true, customer: { name: "Ben", address: { city: "Oslo", country: "Norway" } } })
  ->  "Ben, Oslo, Norway (express)"
