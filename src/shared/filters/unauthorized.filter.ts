import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

import { LoggerConstant } from '@/constants/logger.constant';
import { ErrorMessage } from '@/languages';

import { ExceptionFilterType } from '../interfaces';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const status = HttpStatus.UNAUTHORIZED;

    logger.log(
      LoggerConstant.unauthorized,
      asyncRequestContext.getRequestIdStore(),
    );

    const res = host.switchToHttp().getResponse<FastifyReply>();
    asyncRequestContext.exit();

    return res.code(status).send({
      statusCode: status,
      message:
        exception.message && exception.message !== 'Unauthorized'
          ? exception.message
          : ErrorMessage[status],
    });
  }
}
