import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import dbConfig from '@/database/data-source/data-source'
import { HealthModule } from './health/health.module'
import { QueryLogger } from './logger/query.logger'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useFactory: async (configService: ConfigService) =>
        await configService.get('typeorm')!,
      inject: [ConfigService, QueryLogger],
    }),
    LoggerModule,
    HealthModule,
  ],
  providers: [],
})
export class SharedModule {}
