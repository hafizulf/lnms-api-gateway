import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    if (status === 422) {
      // Preserve the validation error structure
      response.status(status).json(errorResponse);
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: errorResponse['message'] || 'An error occurred',
    });
  }
}
