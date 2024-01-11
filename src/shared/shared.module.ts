import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import dbConfig from '@/database/data-source/data-source'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const {
          type,
          host,
          port,
          username,
          password,
          database,
          entities,
          charset,
          synchronize,
          autoLoadEntities,
          supportBigNumbers,
          bigNumberStrings,
        } = dbConfig()
        return {
          type: type as 'mysql' | undefined,
          host,
          port: Number(port),
          username,
          password,
          database,
          entities,
          logging: 'all',
          synchronize,
          autoLoadEntities,
          charset,
          supportBigNumbers,
          bigNumberStrings,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class SharedModule {}
