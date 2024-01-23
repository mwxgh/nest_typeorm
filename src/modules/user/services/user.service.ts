import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm'
import { Direction, UserLockedEnum, UserStatusEnum } from '@/constants'
import { AbstractService } from '@/shared/services/abstract.service'
import { UserDto, UsersPageOptionsDto } from '../dto'
import { PageDto } from '@/shared/common/dto'

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

  private buildQueryList(
    pageOptionsDto: UsersPageOptionsDto,
  ): SelectQueryBuilder<User> {
    const { role, email } = pageOptionsDto
    const queryBuilder: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user')

    if (role) queryBuilder.where({ role })
    if (email) queryBuilder.andWhere({ email })

    return queryBuilder.orderBy('user.createdAt', Direction.DESC)
  }

  async getUsersPaginate(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder: SelectQueryBuilder<User> =
      this.buildQueryList(pageOptionsDto)

    const [users, pageMeta] = await queryBuilder
      .select([
        'user.id',
        'user.username',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.isLocked',
        'user.status',
        'user.createdAt',
      ])
      .paginate(pageOptionsDto)

    return users.toPageDto(pageMeta)
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.findOneBy({ id })
    if (!user) {
      throw new NotFoundException(`User not found by id ${id}`)
    }
    return user.toDto()
  }
}
