import { AUTH_MESSAGES } from '../constants/authMessages';
import { HttpException } from './httpException';

export class UnauthorizedException extends HttpException {
  constructor(message: string = AUTH_MESSAGES.needLogin) {
    super(401, message);
  }
}
