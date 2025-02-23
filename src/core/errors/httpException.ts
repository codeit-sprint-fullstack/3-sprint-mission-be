import { AUTH_MESSAGES } from '@/constants/authMessages';

export class HttpException extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = '') {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = AUTH_MESSAGES.needLogin) {
    super(401, message);
  }
}
