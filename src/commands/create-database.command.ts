/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync } from 'fs'
import { resolve } from 'path'
import { createDatabase, DatabaseCreateContext } from 'typeorm-extension'
import { config } from 'dotenv'

const {
  env: { NODE_ENV },
  exit,
} = process
const nodeEnv = NODE_ENV || 'development'
let path = resolve(__dirname, `../../.env.${nodeEnv}.local`)
if (!existsSync(path)) path = resolve(__dirname, '../../.env')

let env: any
if (existsSync(path)) {
  const { parsed, error } = config({ path })

  if (error) throw error

  env = parsed
}

const dbName = `${env.DATABASE_DB}${nodeEnv === 'test' ? '_test' : ''}`

const createDb = async () => {
  const contextDb: DatabaseCreateContext = {
    ifNotExist: true,
    options: {
      charset: 'utf8mb4_unicode_ci',
      type: 'mysql',
      database: dbName,
      username: env.DATABASE_USER,
      password: env.DATABASE_PW,
      host: env.DATABASE_HOST,
      port: +env.DATABASE_PORT,
      connectTimeout: 5000,
    },
  }

  try {
    console.log(`Create Database ${dbName} @ ${env.DATABASE_HOST}`)
    await createDatabase(contextDb)
    console.log('Successfully created!')
    exit(0)
  } catch (error) {
    console.error(error)
    exit(1)
  }
}

createDb()
