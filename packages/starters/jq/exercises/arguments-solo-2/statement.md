Print the path of every slow request.

Do not write the limit inside the filter. Pass the number `500` into the command under the name `limit`. A request is slow when its `ms` is above the limit. Print the `path` of each slow request as its own output, in JSON with its quotes.
