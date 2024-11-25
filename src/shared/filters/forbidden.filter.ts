import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { LoggerConstant } from '@/constants'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const status = HttpStatus.FORBIDDEN
    const response = host.switchToHttp().getResponse<FastifyReply>()

    logger.error(
      LoggerConstant.forbidden,
      asyncRequestContext.getRequestIdStore(),
    )

    const error = {
      statusCode: status,
      message:
        exception.message && exception.message !== 'Forbidden'
          ? exception.message
          : ErrorMessage[status],
    }

    asyncRequestContext.exit()

    return response.code(status).send(error)
  }
}
