import { setSeederFactory } from 'typeorm-extension'
import { RoleEnum, UserLockedEnum, BaseStatusEnum } from '@/constants'
import { User } from '@/modules/user/entities/user.entity'

export default setSeederFactory(User, async (faker) => {
  const user = new User()
  user.firstName = faker.name.firstName()
  user.lastName = faker.name.lastName()
  user.username = faker.internet.userName({
    firstName: user.firstName,
    lastName: user.lastName,
  })
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  })
  user.isLocked = faker.helpers.arrayElement([
    UserLockedEnum.Locked,
    UserLockedEnum.Unlocked,
  ])
  user.password = 'Aa@123456'
  user.status = faker.helpers.arrayElement([
    BaseStatusEnum.Active,
    BaseStatusEnum.Inactive,
  ])
  user.role = faker.helpers.arrayElement([
    RoleEnum.BaseAdmin,
    RoleEnum.Supervisor,
  ])

  return user
})
