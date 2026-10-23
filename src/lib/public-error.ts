/** An error whose message is safe to show to a visitor. Anything else stays in the server logs. */
export class PublicError extends Error {
  readonly status: number;

  constructor(message: string, status = 422) {
    super(message);
    this.name = "PublicError";
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
