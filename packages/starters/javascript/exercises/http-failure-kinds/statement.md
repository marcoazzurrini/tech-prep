# HTTP Failure Kinds (medium)

Complete three error classes. `new HttpError(status, message)` makes an error with that `message` and a `status` field. `ClientError` and `ServerError` extend `HttpError` and take the same arguments. Each class sets `name` to its own class name.

Then write `errorForStatus(status, message)`. It returns a new `ClientError` for a status from 400 to 499, a new `ServerError` for 500 to 599, and a new `HttpError` for any other status.

Example 1: errorForStatus(404, "no page")  ->  a ClientError with status 404
Example 2: errorForStatus(503, "busy")  ->  a ServerError with status 503
Example 3: String(new ClientError(400, "bad input"))  ->  "ClientError: bad input"
Example 4: errorForStatus(302, "moved").name  ->  "HttpError"
