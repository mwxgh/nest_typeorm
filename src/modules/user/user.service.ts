import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm'
import {
  AppConstant,
  Direction,
  UserLockedEnum,
  UserStatusEnum,
} from '@/constants'
import { AbstractService } from '@/shared/services/abstract.service'
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UsersPageOptionsDto,
} from './dto'
import { PageDto } from '@/shared/common/dto'
import * as bcrypt from 'bcrypt'
import { trim } from 'lodash'

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  async createUser({ userId, body }: { userId: number; body: CreateUserDto }) {
    await this.validateDuplicate({ username: body.username })

    await this.save({
      ...body,
      password: bcrypt.hashSync(
        AppConstant.defaultPassword,
        bcrypt.genSaltSync(AppConstant.saltOrRounds),
      ),
      createdBy: userId,
      updatedBy: userId,
    })
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

  async findUserById(id: number): Promise<User> {
    const user = await this.findOneBy({ id })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found.`)
    }

    return user
  }

  private buildQueryList(
    pageOptionsDto: UsersPageOptionsDto,
  ): SelectQueryBuilder<User> {
    const { role, email, order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user')

    if (role) queryBuilder.where({ role })
    if (email) queryBuilder.andWhere({ email })
    if (q) {
      queryBuilder.searchByString(trim(q), ['user.firstName', 'user.lastName'])
    }

    return queryBuilder.orderBy(
      `user.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getUsersPaginate(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder: SelectQueryBuilder<User> =
      this.buildQueryList(pageOptionsDto)

    const [users, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return users.toPageDto(pageMeta)
  }

  async getUserById(id: number): Promise<UserDto> {
    return (await this.findUserById(id)).toDto()
  }

  async updateUserById({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateUserDto
  }): Promise<void> {
    const user = await this.findUserById(id)

    await this.updateBy(user.id, { ...body, updatedBy: userId })
  }

  async deleteUserById({ id }: { id: number }): Promise<void> {
    const user = await this.findUserById(id)

    await this.softDelete(user.id)
  }
}
