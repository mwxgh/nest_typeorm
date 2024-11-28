import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

@Catch(UnauthorizedException)
export class UnauthorizedFilter
  implements ExceptionFilter<UnauthorizedException>
{
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(_: UnauthorizedException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam

    const statusCode = HttpStatus.UNAUTHORIZED
    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<FastifyReply>()
    asyncRequestContext.exit()

    return response.code(statusCode).send({
      statusCode,
      message: ErrorMessage[statusCode],
    })
  }
}
