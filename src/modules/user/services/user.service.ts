import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { UserLockedEnum, UserStatusEnum } from '@/constants'
import AbstractService from '@/shared/services/abstract.service'

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  async findUserActive(
    conditions: FindOptionsWhere<User>,
  ): Promise<User | null> {
    return await this.findOneBy({
      ...conditions,
      isLocked: UserLockedEnum.Unlocked,
      status: UserStatusEnum.Active,
    })
  }
}
