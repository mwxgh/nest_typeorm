import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { ExceptionFilterType } from '../interfaces'
import { buildLogParameters, createStore } from '../utils'

@Injectable()
export class LoggerRequestGuard implements CanActivate {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let { logger, asyncRequestContext } = this.filterParam

    let req = context.switchToHttp().getRequest()

    const logContext = createStore(req, asyncRequestContext)

    logger.log(
      `[Params]: ${JSON.stringify(
        buildLogParameters(Object.assign({}, req.body || req.query)),
      )}`,
      logContext,
    )
    ;(logger as any) = (asyncRequestContext as any) = (req as any) = null

    return true
  }
}
