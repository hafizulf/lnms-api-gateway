import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ParseIntExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? exceptionResponse['message']
        : 'Invalid parameter';

    response.status(422).json({
      statusCode: 422,
      message: 'Validation errors',
      errors: [
        {
          field: 'id',
          constraints: {
            invalidType: Array.isArray(message) ? message[0] : message,
          },
        },
      ],
    });
  }
}
