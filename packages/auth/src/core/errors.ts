class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// An error that is thrown when the token is unavailable or empty because `tailor.token` is not set
export const TokenUnavailableError = new AuthError("Token is unavailable");

// An error that is thrown from client hooks in case the session is invalid
export const InvalidSessionError = new AuthError("Invalid session");
