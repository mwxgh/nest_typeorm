import * as Joi from 'hapi__joi';
import { config as configEnv } from 'dotenv';
import config from '@/config/config';

configEnv();
const dbOption = config().database;

const validationSchema = Joi.object({
  APP_NAME: Joi.string().default('NEST_TS'),
  APP_ENV: Joi.string()
    .valid('local', 'production', 'test', 'staging')
    .default('local'),
  APP_KEY: Joi.string(),
  APP_DEBUG: Joi.bool().default('false'),

  FILE_UPLOAD_DESTINATION: Joi.string().required(),
  FILE_UPLOAD_MAX_SIZE: Joi.number().required(),

  JWT_TTL: Joi.number().required(),
  JWT_REFRESH_TTL: Joi.number().required(),

  DATABASE_DRIVER: Joi.string()
    .valid(
      'mysql',
      'mariadb',
      'postgres',
      'cockroachdb',
      'sqlite',
      'mssql',
      'oracle',
      'mongodb',
      'cordova',
      'react-native',
      'expo',
      'nativescript',
    )
    .default(dbOption.driver)
    .required(),
  DATABASE_HOST: Joi.string().required().default(dbOption.host),
  DATABASE_PORT: Joi.number().required().default(dbOption.port),
  DATABASE_DB: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PW: Joi.string().required(),
  DATABASE_LOGGING: Joi.bool(),

  MAIL_MAILER: Joi.string().allow('').optional(),
  MAIL_HOST: Joi.string().allow('').optional(),
  MAIL_PORT: Joi.number().allow('').optional(),
  MAIL_USERNAME: Joi.string().allow('').optional(),
  MAIL_PASSWORD: Joi.string().allow('').optional(),
  MAIL_ENCRYPTION: Joi.string().allow('').optional(),
  MAIL_FROM_ADDRESS: Joi.string().email().allow('').allow('null').optional(),
  MAIL_FROM_NAME: Joi.string().allow('').optional(),
  PORT: Joi.number().default(3000),
});

export default validationSchema;
