export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class ClientError extends HttpError {}
export class ServerError extends HttpError {}

export function errorForStatus(status, message) {
  if (status >= 400 && status < 500) {
    return new ClientError(status, message);
  }

  if (status >= 500 && status < 600) {
    return new ServerError(status, message);
  }

  return new HttpError(status, message);
}
