export class APIError extends Error {
  public errorCode: number;
  constructor(errorCode = 500, errorMessage: string) {
    super(errorMessage);
    this.errorCode = errorCode;
  }
}
