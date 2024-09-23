import InitSeeder from '@/database/seeds/init.seeder'
import userFactory from '@/database/factories/user.factory'
import { User } from '@/modules/user/entities/user.entity'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { runSeeders, SeederOptions } from 'typeorm-extension'
import config from '@/config/config'

const { driver, host, username, port, password, db } = config().database

const options: DataSourceOptions & SeederOptions = {
  type: driver,
  host,
  username,
  port,
  password,
  database: db,
  entities: [User],
  factories: [userFactory],
  seeds: [InitSeeder],
}

const dataSource = new DataSource(options)

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true)
  await runSeeders(dataSource)
  process.exit()
})
