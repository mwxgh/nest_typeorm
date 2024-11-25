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
import { LoggerConstant } from '@/constants/logger.constant'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'
import { createStore } from '../utils'

@Catch(EntityNotFoundError, NotFoundException)
export class EntityNotfoundFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(_: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const status = HttpStatus.NOT_FOUND
    const response = host.switchToHttp().getResponse<FastifyReply>()
    const req = host.switchToHttp().getRequest()

    const store = createStore(req, asyncRequestContext)

    logger.warn(LoggerConstant.notFound, store)

    const error = {
      statusCode: status,
      message: ErrorMessage[status],
    }

    asyncRequestContext.exit()

    return response.code(status).send(error)
  }
}
