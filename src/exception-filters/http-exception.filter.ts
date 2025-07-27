import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';
import { CustomException } from "../exceptions/custom.exception";

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    const customPayload = typeof exceptionResponse === 'string'
      ? { error: exceptionResponse }
      : exceptionResponse;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      ...customPayload,
    });
  }
}
