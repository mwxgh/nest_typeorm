import { config as configEnv } from 'dotenv';
import { DataSource } from 'typeorm';

import config from '@/config/config';

configEnv();
const dbOption = config().database;

export const AppDataSource = new DataSource({
  type: dbOption.driver,
  host: dbOption.host,
  username: dbOption.username,
  port: dbOption.port,
  password: dbOption.password,
  database: dbOption.db,
  synchronize: false,
  logging: false,
  entities: [
    process.env.NODE_ENV === 'test'
      ? 'src/modules/**/entities/*.entity.ts'
      : 'dist/modules/**/entities/*.entity.js',
  ],
  subscribers: [],
  migrations: [
    process.env.NODE_ENV === 'test'
      ? 'src/database/migrations/*.ts'
      : 'dist/database/migrations/*.js',
  ],
  extra: {
    charset: 'utf8mb4_general_ci',
  },
  charset: 'utf8mb4_general_ci',
  supportBigNumbers: true,
  bigNumberStrings: false,
});
