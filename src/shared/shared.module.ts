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
      // useFactory: async (configService: ConfigService) => ({
      //   type: configService.get('DATABASE_DRIVER').toString(),
      //   host: configService.get('DATABASE_HOST'),
      //   port: configService.get('DATABASE_PORT'),
      //   username: configService.get('DATABASE_USER'),
      //   password: configService.get('DATABASE_PW').toString(),
      //   database: configService.get('DATABASE_DB').toString(),
      //   entities: [
      //     configService.get('APP_ENV') === 'test'
      //       ? 'src/modules/**/entities/*.entity.ts'
      //       : 'dist/modules/**/entities/*.entity.js',
      //   ],
      //   logging: 'all',
      //   synchronize: false,
      //   autoLoadEntities: true,
      //   charset: 'utf8mb4_unicode_ci',
      //   supportBigNumbers: true,
      //   bigNumberStrings: false,
      // }),
      useFactory: async () => ({
        type: dbConfig().type as 'mysql' | 'mariadb' | undefined,
        host: dbConfig().host,
        port: Number(dbConfig().port),
        username: dbConfig().username,
        password: dbConfig().password,
        database: dbConfig().database,
        entities: dbConfig().entities,
        logging: 'all',
        synchronize: false,
        autoLoadEntities: true,
        charset: dbConfig().charset,
        supportBigNumbers: true,
        bigNumberStrings: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class SharedModule {}
