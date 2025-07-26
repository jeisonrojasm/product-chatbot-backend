import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, customCode?: number) {
    super(
      {
        response: false,
        error: message,
        code: customCode ?? 1001,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}