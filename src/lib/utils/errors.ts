export class NonExistentUserError extends Error {
  constructor() {
    super();
    this.name = "NonExistentUserError";
    this.message = "User does not exist.";
  }
}

export type AuthorizationErrorDetails = {
  action: string;
};
export class UserNotAuthorizedError extends Error {
  constructor(details?: AuthorizationErrorDetails) {
    super();
    this.name = "UserNotAuthorizedError";
    this.message = `User is not authorized.\nDetails: ${JSON.stringify(
      details
    )}`;
  }
}
