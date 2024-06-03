class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export const NoSessionError = new AuthError("No session available");
