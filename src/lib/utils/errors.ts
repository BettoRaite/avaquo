export class NonExistentUserError extends Error {
  constructor() {
    super();
    this.name = "NonExistentUserError";
    this.message = "User does not exist.";
  }
}
