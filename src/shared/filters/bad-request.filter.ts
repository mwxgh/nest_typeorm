import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { LoggerConstant } from '@/constants/logger.constant'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const status = HttpStatus.BAD_REQUEST

    logger.error(
      LoggerConstant.badRequest,
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<FastifyReply>()
    asyncRequestContext.exit()

    return response.code(status).send({
      statusCode: status,
      message:
        exception.message && exception.message !== 'Bad Request'
          ? exception.message
          : ErrorMessage[status],
    })
  }
}
