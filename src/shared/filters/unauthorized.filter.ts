import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { LoggerConstant } from '@/constants/logger.constant'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const status = HttpStatus.UNAUTHORIZED

    logger.error(
      LoggerConstant.unauthorized,
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<FastifyReply>()
    asyncRequestContext.exit()

    return response.code(status).send({
      statusCode: status,
      message:
        exception.message && exception.message !== 'Unauthorized'
          ? exception.message
          : ErrorMessage[status],
    })
  }
}
