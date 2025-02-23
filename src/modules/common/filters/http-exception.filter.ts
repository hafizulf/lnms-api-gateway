import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle Axios errors (e.g., user service responses)
    if (exception.response && exception.response.data) {
      const { status, data } = exception.response;
      response.status(status).json(data);
      return;
    }

    // Handle connection errors (e.g., when the user service is down)
    if (exception.code === 'ECONNREFUSED') {
      response.status(503).json({
        statusCode: 503,
        message: 'User service is unavailable. Please try again later.',
      });
      return;
    }

    // Handle NestJS-specific HttpExceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (status === 400) {
        throw new BadRequestException(errorResponse);
      }
      if (status === 404) {
        throw new NotFoundException(errorResponse);
      }
      if (status === 409) {
        throw new ConflictException(errorResponse);
      }

      response.status(status).json({
        statusCode: status,
        message: errorResponse['message'] || 'An error occurred',
      });
      return;
    }

    // Default Internal Server Error for unexpected exceptions
    console.error('Unhandled error:', exception);
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
