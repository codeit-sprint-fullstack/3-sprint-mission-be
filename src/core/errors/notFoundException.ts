import { HttpException } from './httpException';

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}
