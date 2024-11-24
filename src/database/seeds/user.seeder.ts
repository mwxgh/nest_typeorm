import { RoleEnum } from '@/constants'
import { User } from '@/modules/user/entities/user.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User)

    const data = {
      username: 'admin',
      password: 'Aa@123456',
      role: RoleEnum.BaseAdmin,
      isActivated: true,
    }

    const user = await repository.findOneBy({ username: data.username })

    if (!user) {
      await repository.insert([data])
    }

    const userFactory = await factoryManager.get(User)

    await userFactory.save()

    await userFactory.saveMany(5)
  }
}
