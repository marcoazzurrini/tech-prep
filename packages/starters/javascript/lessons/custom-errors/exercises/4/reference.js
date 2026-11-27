export class NetworkError extends Error {}
export class OfflineError extends NetworkError {}
export class AuthError extends Error {}

export function handle(task) {
  try {
    return task();
  } catch (error) {
    if (error instanceof NetworkError) {
      return "retry later";
    }

    if (error instanceof AuthError) {
      return "denied";
    }

    throw error;
  }
}
