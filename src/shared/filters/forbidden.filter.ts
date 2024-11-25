import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AppConstant, LoggerConstant } from '@/constants';
import { ErrorMessage } from '@/languages';
import { ExceptionFilterType } from '../interfaces';

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) { }

  catch(err: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const status = HttpStatus.FORBIDDEN;
    const response = host.switchToHttp().getResponse<FastifyReply>();

    logger.log(
      LoggerConstant.forbidden,
      asyncRequestContext.getRequestIdStore(),
    );

    const error = {
      statusCode: status,
      message:
        err.message === AppConstant.forbiddenError
          ? null
          : ErrorMessage[status],
    };

    asyncRequestContext.exit();

    return response.code(status).send(error);
  }
}
