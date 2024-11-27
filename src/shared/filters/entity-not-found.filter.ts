import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { EntityNotFoundError } from 'typeorm'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'
import { createStore } from '../utils'

@Catch(EntityNotFoundError, NotFoundException)
export class EntityNotfoundFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(_: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam

    const statusCode = HttpStatus.NOT_FOUND
    const req = host.switchToHttp().getRequest()
    const store = createStore(req, asyncRequestContext)

    logger.warn(ErrorMessage[statusCode], store)

    const response = host.switchToHttp().getResponse<FastifyReply>()

    asyncRequestContext.exit()

    return response.code(statusCode).send({
      statusCode,
      message: ErrorMessage[statusCode],
    })
  }
}
