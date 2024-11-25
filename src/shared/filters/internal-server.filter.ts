import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { ExceptionFilterType } from '../interfaces'
import { ErrorMessage } from '@/messages'

@Catch()
export class InternalServerFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: TypeError, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const status = HttpStatus.INTERNAL_SERVER_ERROR
    const response = host.switchToHttp().getResponse<FastifyReply>()

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
