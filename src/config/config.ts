export default () => ({
  app: {
    port: process.env.APP_PORT || 3000,
    name: process.env.APP_NAME,
    env: process.env.APP_ENV || 'development',
    url: process.env.APP_URL,
    timeout: process.env.APP_TIMEOUT || 30000,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
  },

  database: {
    driver: process.env.DATABASE_DRIVER as 'mysql' | 'mongodb',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    db: process.env.DATABASE_DB,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PW,
    ttl: process.env.REDIS_TTL || 300,
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    from: process.env.MAIL_FROM,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
})
