import { registerAs } from '@nestjs/config'
import config from '../../config/config'
import { DataSource, DataSourceOptions } from 'typeorm'

const dbOption = config().database

const dbConfig = {
  type: dbOption.driver,
  host: dbOption.host,
  username: dbOption.username,
  port: dbOption.port,
  password: dbOption.password,
  database: dbOption.db,
  autoLoadEntities: true,
  synchronize: false,
  charset: 'utf8mb4_general_ci',
  supportBigNumbers: true,
  bigNumberStrings: false,
  subscribers: [],
  extra: {
    charset: 'utf8mb4_general_ci',
  },
  entities: ['dist/modules/**/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  logging: 'all',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
}

export default registerAs('typeorm', () => dbConfig)
export const connectionSource = new DataSource(dbConfig as DataSourceOptions)
