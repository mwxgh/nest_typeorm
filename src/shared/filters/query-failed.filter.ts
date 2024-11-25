import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus } from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { QueryFailedError } from 'typeorm'
import { AppConstant } from '@/constants'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const { logger, asyncRequestContext } = this.filterParam
    const response = host.switchToHttp().getResponse<FastifyReply>()

    const status =
      exception.driverError?.name === AppConstant.uniqueQueryCode
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR

    logger.error(
      `Query Error: ${exception.query}`,
      null,
      asyncRequestContext.getRequestIdStore(),
    )
    logger.error(
      exception.stack || exception.toString(),
      null,
      asyncRequestContext.getRequestIdStore(),
    )

    const error = {
      statusCode: status,
      message:
        exception.message && exception.message !== 'Internal Server'
          ? exception.message
          : ErrorMessage[status],
    }

    asyncRequestContext.exit()

    return response.code(status).send(error)
  }
}
