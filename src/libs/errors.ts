/* The BackendError class is used to denote when there's an error coming from the backend in response to a hit on an endpoint. The custom class is to make it easier for the code to know when the error is from the backend and to decide what to show the user
 */
export class BackendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackendError";
    Object.setPrototypeOf(this, BackendError.prototype);
  }
}

/* This error is for when the user's email or phone number is not verified. There's a custom error class instead of the BackendError generic because if we throw the next redirect wrror from the authorize function of next-auth, then we will not be able to redirect properly*/
export type VerificationType = "EMAIL" | "PHONE";

export class NotVerifiedError extends Error {
  public type: VerificationType;

  constructor(message: string, type: VerificationType) {
    super(message);
    this.name = "NotVerifiedError";
    this.type = type;

    Object.setPrototypeOf(this, NotVerifiedError.prototype);
  }
}
