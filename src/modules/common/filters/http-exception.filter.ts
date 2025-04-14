import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { getServiceNameMap } from 'src/modules/common/utils/service-name-map';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.response && exception.response.data) {
      const { status, data } = exception.response;

      // Ensure 'errors' array is forwarded properly
      response.status(status).json({
        statusCode: status,
        message: data.message || 'An error occurred',
        errors: data.errors || [], // Preserve validation errors
      });
      return;
    }

    if (exception.code === 'ECONNREFUSED') {
      const baseURL = exception?.config?.baseURL || '';
      const requestUrl = exception?.config?.url || '';
      const fullUrl = baseURL ? `${baseURL}${requestUrl}` : requestUrl;

      const serviceNameMap = getServiceNameMap(this.configService);
      const matchKey = Object.keys(serviceNameMap).find(
        (key) => fullUrl.startsWith(key) || baseURL.startsWith(key),
      );
      const serviceName = serviceNameMap[matchKey || ''] || 'Upstream Service';

      const isProd =
        this.configService.get<string>('NODE_ENV') === 'production';

      response.status(503).json({
        statusCode: 503,
        message: isProd
          ? `${serviceName} is temporarily unavailable. Please try again later.`
          : `${serviceName} (${fullUrl}) is unavailable. Please try again later.`,
        error: 'Service Unavailable',
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      response.status(status).json({
        statusCode: status,
        message:
          typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse['message'] || 'An error occurred',
        error: exception.name || 'Error',
        errors: errorResponse['errors'] || [], // Ensure errors array is forwarded
      });
      return;
    }

    console.error('Unhandled error:', exception);

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }
}
