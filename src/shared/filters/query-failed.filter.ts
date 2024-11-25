import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

import { AppConstant } from '@/constants';
import { ValidationMessage } from '@/languages';

import { ExceptionFilterType } from '../interfaces';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  constructor(private readonly filterParam: ExceptionFilterType) { }

  catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const status =
      exception.driverError?.name === AppConstant.uniqueQueryCode
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR;

    logger.error(
      `Query Error: ${exception.query}`,
      null,
      asyncRequestContext.getRequestIdStore(),
    );
    logger.error(
      exception.stack || exception.toString(),
      null,
      asyncRequestContext.getRequestIdStore(),
    );

    asyncRequestContext.exit();

    return response.code(status).send({
      statusCode: status,
      error: STATUS_CODES[status],
      message: ValidationMessage.badRequestError,
    });
  }
}
