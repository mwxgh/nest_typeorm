import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const statusCode = HttpStatus.BAD_REQUEST

    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<FastifyReply>()
    asyncRequestContext.exit()

    return response.code(statusCode).send({
      statusCode,
      message:
        exception.message && exception.message !== 'Bad Request'
          ? exception.message
          : ErrorMessage[statusCode],
    })
  }
}
