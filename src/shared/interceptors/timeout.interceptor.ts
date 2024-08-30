import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import config from '@/config/config'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutValue: number

  constructor(private readonly configService: ConfigService) {
    const timeoutConfig = config().app.timeout
    this.timeoutValue =
      typeof timeoutConfig === 'string'
        ? parseInt(timeoutConfig, 10)
        : timeoutConfig

    if (isNaN(this.timeoutValue) || this.timeoutValue <= 0) {
      throw new Error(`Invalid timeout value: ${timeoutConfig}`)
    }
  }

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutValue),
      catchError((err) =>
        err instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException())
          : throwError(() => err),
      ),
    )
  }
}
