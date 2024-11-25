import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { LoggerConstant } from '@/constants/logger.constant';
import { ErrorMessage } from '@/languages';
import { ExceptionFilterType } from '../interfaces';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const status = HttpStatus.BAD_REQUEST;
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const responseException = exception.getResponse() as any;

    logger.log(
      LoggerConstant.badRequest,
      asyncRequestContext.getRequestIdStore(),
    );

    const error = {
      statusCode: responseException?.customCode || status,
      message:
        responseException.message ||
        (exception.message && exception.message !== 'Bad Request'
          ? exception.message
          : ErrorMessage[status]),
    };

    asyncRequestContext.exit();

    return response.code(status).send(error);
  }
}
