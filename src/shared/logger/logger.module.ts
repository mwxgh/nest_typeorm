import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import { AppConstant } from '@/constants/app.constant'
import {
  AsyncRequestContext,
  AsyncRequestContextModule,
} from '@/modules/async-context-request'

import { loggerFormat } from './logger.format'
import { QueryLogger } from './query.logger'

const formatted = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: process.env.TZ,
  })
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule, AsyncRequestContextModule],
      useFactory: (
        configService: ConfigService,
        asyncContext: AsyncRequestContext,
      ) => ({
        transports: [
          new transports.Console({
            silent: configService.get('APP_ENV') === AppConstant.test,
            format: format.combine(
              format.timestamp({ format: formatted }),
              loggerFormat(asyncContext),
            ),
          }),
        ],
      }),
      inject: [ConfigService, AsyncRequestContext],
    }),
  ],
  providers: [QueryLogger],
  exports: [QueryLogger],
})
export class LoggerModule {}
