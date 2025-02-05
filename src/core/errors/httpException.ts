export class HttpException extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
