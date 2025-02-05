import { HttpException } from './httpException';

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}
