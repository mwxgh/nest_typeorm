import { registerAs } from '@nestjs/config'
import { config as dotenvConfig } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

dotenvConfig({ path: '.env' })

const dbConfig = {
  type: `${process.env.DATABASE_DRIVER}`,
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PW}`,
  database: `${process.env.DATABASE_DB}`,
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
}

export default registerAs('typeorm', () => dbConfig)
export const connectionSource = new DataSource(dbConfig as DataSourceOptions)
