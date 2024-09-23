import { DataSource } from 'typeorm'
import { runSeeders, Seeder } from 'typeorm-extension'

import userFactory from '../factories/user.factory'
import UserSeeder from './user.seeder'

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder],
      factories: [userFactory],
    })
  }
}
